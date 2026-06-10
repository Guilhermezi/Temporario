import { useState, useEffect } from "react";
import { Loader2, Send, Trash2, ShieldCheck } from "lucide-react";
import { api, type Post } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postErr, setPostErr] = useState("");

  const load = () => {
    api.community
      .feed()
      .then(setPosts)
      .catch((e: Error) => setLoadErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!text.trim()) return;
    setPostErr(""); setPosting(true);
    try {
      const p = await api.community.post(text.trim());
      setPosts((x) => [p, ...x]);
      setText("");
    } catch (e: unknown) {
      setPostErr(e instanceof Error ? e.message : "Erro ao publicar");
    } finally {
      setPosting(false);
    }
  };

  const del = async (id: string) => {
    try {
      await api.community.delete(id);
      setPosts((x) => x.filter((p) => p.id !== id));
    } catch (e: unknown) {
      console.error("[Feed] erro ao deletar post:", e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 fade-up">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">Comunidade</p>
        <h1 className="font-serif font-black text-5xl text-ink-900">Feed</h1>
        <p className="text-ink-500 mt-2 text-sm">Compartilhe e inspire outras pessoas a consumir com consciência.</p>
      </div>

      {/* Compose */}
      {user && (
        <div className="card mb-8">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/20 grid place-items-center text-sm font-bold text-gold-600 shrink-0">
              {(user.displayName ?? user.username)[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Compartilhe sua experiência com produtos originais..."
                className="w-full bg-transparent resize-none text-sm text-ink-900 placeholder-ink-400 focus:outline-none min-h-20 leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submit(); }}
              />
              {postErr && <p className="text-xs text-red-600 mt-1">{postErr}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100">
                <span className="text-xs text-ink-400">⌘ + Enter para publicar</span>
                <button
                  onClick={submit}
                  disabled={posting || !text.trim()}
                  className="btn-primary text-sm py-2 px-5"
                >
                  {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-ink-400" />
        </div>
      ) : loadErr ? (
        <div className="text-center py-20 text-red-600">{loadErr}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-ink-400">
          <p className="font-serif text-xl font-bold text-ink-700 mb-2">Nenhuma publicação ainda.</p>
          <p className="text-sm">Seja o primeiro a compartilhar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="card hover:border-ink-300 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/20 grid place-items-center text-sm font-bold text-gold-600 shrink-0">
                    {(p.user.displayName ?? p.user.username)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">
                      {p.user.displayName ?? p.user.username}
                    </div>
                    <div className="text-xs text-ink-400">
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {p.isAuto && (
                    <span className="tag-green">
                      <ShieldCheck size={10} /> verificado
                    </span>
                  )}
                  {user?.username === p.user.username && (
                    <button
                      onClick={() => del(p.id)}
                      className="text-ink-300 hover:text-red-500 transition-colors p-1"
                      aria-label="Deletar post"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-ink-700 leading-relaxed mb-4">{p.content}</p>

              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt="Selo"
                  className="w-full rounded-xl border border-ink-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
