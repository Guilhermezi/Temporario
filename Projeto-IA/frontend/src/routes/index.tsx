import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Marquee } from "@/components/site";
import { ShieldCheck, Zap, Building2, ArrowRight, Sparkles, QrCode, FileText, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "byTrust — Protegendo sua confiança, produto por produto" },
      { name: "description", content: "API de verificação de autenticidade em tempo real. Combate à falsificação para consumidores, varejistas e marcas." },
      { property: "og:title", content: "byTrust — Tecnologia antipirataria" },
      { property: "og:description", content: "Verifique a autenticidade de qualquer produto em 3 segundos." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center relative">
        <div className="text-xs uppercase tracking-[0.3em] font-mono mb-6 text-muted-foreground">
          Junte-se à comunidade antifalsificação
        </div>
        <div className="relative inline-block">
          <span className="absolute -top-8 -left-6 text-3xl rotate-[-15deg]">🍒</span>
          <span className="absolute -top-10 right-0 text-2xl">💬</span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[1.05] max-w-5xl mx-auto">
            <span className="tape px-4 py-1 inline-block">byTrust</span>
            <span className="block mt-3">protegendo sua <em>confiança,</em></span>
            <span className="block">produto por produto</span>
          </h1>
        </div>

        <div className="flex justify-center mt-8">
          <div className="sticker max-w-xs text-left leading-tight">
            Onde a autenticidade<br/>vira certeza, e a falsificação<br/>vira história.
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/verificador" className="btn-pill-primary">
            Verificar autenticidade agora <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/learning" className="btn-pill">
            Aprender mais
          </Link>
        </div>

        <p className="mt-8 max-w-2xl mx-auto text-muted-foreground">
          A API byTrust valida cada item em tempo real — um simples código, QR ou foto basta para confirmar
          se um produto é <strong>original</strong> ou <strong>falsificado</strong>.
        </p>
      </section>

      <Marquee items={["Verificação em tempo real", "+500 mil produtos verificados", "API antipirataria", "Confiança certificada"]} />

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-tan text-sm font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" /> Bem-vindo à byTrust
          </div>
          <h2 className="font-display text-4xl md:text-5xl max-w-3xl mx-auto">
            Para marcas, varejistas e consumidores cansados da falsificação.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Ajudamos empresas a proteger seu nome e consumidores a comprar com segurança,
            unindo rastreabilidade, design e tecnologia.
          </p>
          <div className="sticker mt-6 bg-tan/40">Mais que API. É confiança.</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ShieldCheck, title: "Verificador", bg: "bg-blue/50", text: "Confirme a autenticidade em segundos com código, QR ou foto.", cta: "Verificar →", href: "/verificador" },
            { icon: GraduationCap, title: "Learning", bg: "bg-green/50", text: "Trilhas educativas para consumidores, varejistas e marcas.", cta: "Aprender →", href: "/learning" },
            { icon: FileText, title: "Cartilhas", bg: "bg-tan/50", text: "Guias em PDF prontos para download e distribuição.", cta: "Baixar →", href: "/cartilhas" },
            { icon: Zap, title: "API", bg: "bg-card", text: "Integre a verificação byTrust no seu estoque, e-commerce ou app.", cta: "Saiba mais →", href: "/verificador" },
          ].map((c) => (
            <div key={c.title} className={`card-soft ${c.bg}`}>
              <div className="w-11 h-11 rounded-full border-2 border-foreground bg-card grid place-items-center mb-4">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl mb-2">{c.title}</h3>
              <p className="text-sm text-foreground/80 mb-5">{c.text}</p>
              <Link to={c.href} className="inline-block text-sm font-medium border-b-2 border-foreground hover:text-tan hover:border-tan">
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Insider club */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-tan text-sm font-mono uppercase tracking-wider mb-3">Clube de marcas</div>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            Entre para o clube de <em>marcas protegidas</em> byTrust.
          </h2>
          <p className="text-lg font-medium mb-3">
            Aqui a falsificação vira rastreabilidade. A dúvida vira certeza.
          </p>
          <p className="text-muted-foreground mb-3">
            Um ecossistema onde fabricantes, varejistas e consumidores compartilham os mesmos dados
            de autenticidade, em tempo real, com selo verificado.
          </p>
          <p className="text-muted-foreground mb-6">Pronto para proteger sua marca?</p>
          <Link to="/contato" className="btn-pill"><Building2 className="w-4 h-4" /> Quero entrar no clube</Link>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl border-2 border-foreground bg-blue/40 p-8 grid place-items-center">
            <div className="text-center">
              <QrCode className="w-32 h-32 mx-auto mb-4" strokeWidth={1} />
              <div className="sticker">Cada produto tem sua história</div>
            </div>
          </div>
          <span className="absolute -top-6 -right-6 text-5xl">🪩</span>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-tan/30 border-y-2 border-foreground py-14">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { n: "+500k", l: "Produtos verificados" },
            { n: "<3s", l: "Tempo médio de resposta da API" },
            { n: "150+", l: "Marcas parceiras protegidas" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-6xl md:text-7xl">{s.n}</div>
              <div className="text-sm uppercase tracking-wider font-mono mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center font-display text-4xl mb-10">
          <span className="text-destructive">♥</span> Quem confia na byTrust
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "Marina S.", t: "Aprendi com a byTrust a nunca mais cair em falsificações de perfumes." },
            { n: "Rafael L.", t: "Integramos a API em 2 dias. Reduziu reclamações por falso em 80%." },
            { n: "Ana P.", t: "Como varejista, finalmente tenho uma forma confiável de validar fornecedores." },
            { n: "Tech Brand", t: "A rastreabilidade aumentou a percepção de valor da nossa marca." },
          ].map((p) => (
            <div key={p.n} className="card-soft bg-card text-center">
              <div className="w-20 h-20 rounded-full bg-tan/60 mx-auto mb-4 border-2 border-foreground grid place-items-center font-display text-2xl">
                {p.n[0]}
              </div>
              <div className="font-display text-xl mb-2">{p.n}</div>
              <p className="text-sm text-muted-foreground">"{p.t}"</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
