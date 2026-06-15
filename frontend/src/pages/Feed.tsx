import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Loader2, Send, Trash2, ShieldCheck, Newspaper, ExternalLink,
} from "lucide-react";
import { api, type Post } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { getPageCopy } from "../locales/pageCopy";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseNewsPost(content: string) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const rawTitle = lines.find((l) => l.startsWith("📰")) ?? "";
  const dateLine = lines.find((l) => l.startsWith("📅")) ?? "";
  const sourceLine = lines.find((l) => l.startsWith("🔗 Fonte:")) ?? "";
  const urlLine = lines.find((l) => /^https?:\/\//i.test(l)) ?? "";
  const bodyLines = lines.filter(
    (l) =>
      !l.startsWith("📰") &&
      !l.startsWith("📅") &&
      !l.startsWith("🔗 Fonte:") &&
      !/^https?:\/\//i.test(l),
  );
  return {
    title: rawTitle.replace(/^📰\s*/, "").trim(),
    date: dateLine.replace(/^📅\s*/, "").trim(),
    source: sourceLine.replace(/^🔗 Fonte:\s*/, "").trim(),
    url: urlLine,
    description: bodyLines.join(" ").trim(),
  };
}

function isNewsPost(post: Post) {
  return post.isAuto && (post.content.includes("📰") || post.content.includes("🔗 Fonte:"));
}

// ─── Cards ───────────────────────────────────────────────────────────────────

function NewsCard({
  post,
  featured,
  lang,
  onDelete,
  deleteLabel,
  c,
}: {
  post: Post;
  featured: boolean;
  lang: string;
  onDelete?: () => void;
  deleteLabel: string;
  c: ReturnType<typeof getPageCopy>["feed"];
}) {
  const { title, date, source, url, description } = parseNewsPost(post.content);

  return (
    <article
      className={[
        "group flex flex-col bg-white border border-ink-100 rounded-2xl overflow-hidden",
        "hover:shadow-md transition-shadow duration-200",
        featured ? "md:col-span-2" : "",
      ].join(" ")}
    >
      {/* Category bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink-50">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-600">
          <Newspaper size={11} />
          {c.news}
        </span>
        <div className="flex items-center gap-3">
          {date && (
            <time className="text-xs text-ink-400">{date}</time>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label={deleteLabel}
              className="text-ink-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={["flex flex-col gap-3 p-5 flex-1", featured ? "md:flex-row md:gap-8" : ""].join(" ")}>
        <div className="flex-1 min-w-0">
          {title && (
            <h2
              className={[
                "font-serif font-black text-ink-900 leading-tight mb-2",
                featured ? "text-2xl md:text-3xl" : "text-lg",
              ].join(" ")}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className={["text-ink-600 leading-relaxed line-clamp-4", featured ? "text-base" : "text-sm line-clamp-3"].join(" ")}>
              {description}
            </p>
          )}
        </div>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={title}
            className={[
              "rounded-xl object-cover border border-ink-100",
              featured ? "md:w-64 md:h-44 w-full h-40" : "w-full h-36",
            ].join(" ")}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
      </div>

      {/* Footer */}
      {(source || url) && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-ink-50 bg-cream-50/60">
          {source && (
            <span className="text-xs text-ink-400 font-medium truncate max-w-[60%]">
 {(source || url) && (
  <div className="flex items-center justify-between px-5 py-3 border-t border-ink-50 bg-cream-50/60">
    {source && (
      <span className="text-xs text-ink-400 font-medium truncate max-w-[60%]">
        {c.source}: <span className="text-ink-600">{source}</span>
      </span>
    )}
    {url && (
      
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors ml-auto"
      >
        {c.readMore} <ExternalLink size={11} />
      </a>
    )}
  </div>
)}
  lang,
  onDelete,
  deleteLabel,
  c,
}: {
  post: Post;
  lang: string;
  onDelete?: () => void;
  deleteLabel: string;
  c: ReturnType<typeof getPageCopy>["feed"];
}) {
  const name = post.user.displayName ?? post.user.username;
  const initial = name[0].toUpperCase();

  return (
    <article className="flex flex-col bg-white border border-ink-100 rounded-2xl p-5 hover:shadow-sm transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold-500/10 grid place-items-center text-xs font-bold text-gold-600 shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900 leading-none">{name}</p>
            <time className="text-xs text-ink-400">
              {new Date(post.createdAt).toLocaleDateString(lang)}
            </time>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isAuto && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ShieldCheck size={10} /> {c.verified}
            </span>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label={deleteLabel}
              className="text-ink-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-ink-700 leading-relaxed flex-1">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          className="mt-4 w-full rounded-xl border border-ink-100 object-cover max-h-52"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
    </article>
  );
}

// ─── Composer ────────────────────────────────────────────────────────────────

function Composer({
  c,
  username,
  displayName,
  onPost,
}: {
  c: ReturnType<typeof getPageCopy>["feed"];
  username: string;
  displayName?: string;
  onPost: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");
  const name = displayName ?? username;

  const submit = async () => {
    if (!text.trim()) return;
    setErr("");
    setPosting(true);
    try {
      await onPost(text.trim());
      setText("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5 mb-8">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gold-500/10 grid place-items-center text-xs font-bold text-gold-600 shrink-0">
          {name[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={c.placeholder}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submit(); }}
            className="w-full bg-transparent resize-none text-sm focus:outline-none min-h-[72px] text-ink-800 placeholder:text-ink-400"
          />
          {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100">
            <span className="text-xs text-ink-400">{c.shortcut}</span>
            <button
              onClick={submit}
              disabled={posting || !text.trim()}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50"
            >
              {posting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              {posting ? c.publishing : c.publish}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Feed() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const c = getPageCopy(i18n.language).feed;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    api.community
      .feed()
      .then(setPosts)
      .catch((e: Error) => setLoadErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async (text: string) => {
    const p = await api.community.post(text);
    setPosts((prev) => [p, ...prev]);
  };

  const handleDelete = async (id: string) => {
    await api.community.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Separa primeiro post de notícia para tratamento de destaque
  const newsPosts = posts.filter(isNewsPost);
  const regularPosts = posts.filter((p) => !isNewsPost(p));
  const featuredNews = newsPosts[0] ?? null;
  const restNews = newsPosts.slice(1);

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5">

        {/* Header editorial */}
        <div className="border-b-2 border-ink-900 pb-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 mb-1">
            {c.eyebrow}
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-serif font-black text-4xl md:text-5xl text-ink-900 leading-none">
              {c.title}
            </h1>
            <p className="text-sm text-ink-400 hidden md:block pb-1">{c.text}</p>
          </div>
        </div>

        {/* Composer */}
        {user && (
          <Composer
            c={c}
            username={user.username}
            displayName={user.displayName}
            onPost={handlePost}
          />
        )}

        {/* Estados */}
        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-ink-300" size={32} />
          </div>
        )}

        {!loading && loadErr && (
          <div className="text-center py-24 text-red-600 text-sm">{loadErr}</div>
        )}

        {!loading && !loadErr && posts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif text-2xl font-black text-ink-900 mb-2">{c.empty}</p>
            <p className="text-sm text-ink-400">{c.first}</p>
          </div>
        )}

        {/* Grid editorial */}
        {!loading && !loadErr && posts.length > 0 && (
          <div className="space-y-10">

            {/* Manchete principal */}
            {featuredNews && (
              <section>
                <SectionLabel label={c.news} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NewsCard
                    post={featuredNews}
                    featured
                    lang={i18n.language}
                    onDelete={user?.username === featuredNews.user.username ? () => handleDelete(featuredNews.id) : undefined}
                    deleteLabel={c.delete}
                    c={c}
                  />
                  {/* Notícias secundárias ao lado da manchete */}
                  {restNews.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {restNews.slice(0, 2).map((p) => (
                        <NewsCard
                          key={p.id}
                          post={p}
                          featured={false}
                          lang={i18n.language}
                          onDelete={user?.username === p.user.username ? () => handleDelete(p.id) : undefined}
                          deleteLabel={c.delete}
                          c={c}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Demais notícias em grid */}
                {restNews.length > 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {restNews.slice(2).map((p) => (
                      <NewsCard
                        key={p.id}
                        post={p}
                        featured={false}
                        lang={i18n.language}
                        onDelete={user?.username === p.user.username ? () => handleDelete(p.id) : undefined}
                        deleteLabel={c.delete}
                        c={c}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Posts da comunidade */}
            {regularPosts.length > 0 && (
              <section>
                {featuredNews && <SectionLabel label={c.community ?? "Comunidade"} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularPosts.map((p) => (
                    <RegularPostCard
                      key={p.id}
                      post={p}
                      lang={i18n.language}
                      onDelete={user?.username === p.user.username ? () => handleDelete(p.id) : undefined}
                      deleteLabel={c.delete}
                      c={c}
                    />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">{label}</span>
      <div className="flex-1 h-px bg-ink-100" />
    </div>
  );
}