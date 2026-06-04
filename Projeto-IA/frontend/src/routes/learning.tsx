import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import { Users, Store, Factory, ChevronDown, Play, Trophy, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Learning — Aprenda a combater a falsificação | byTrust" },
      { name: "description", content: "Centro educativo byTrust: trilhas, quiz, infográficos e glossário sobre autenticidade de produtos." },
    ],
    links: [{ rel: "canonical", href: "/learning" }],
  }),
  component: LearningPage,
});

const signs = [
  { title: "Embalagem desalinhada", desc: "Falhas de impressão, cores fora do padrão." },
  { title: "Preço bom demais", desc: "Descontos absurdos costumam esconder falsos." },
  { title: "Vendedor sem nota", desc: "Originais sempre têm rastreabilidade fiscal." },
  { title: "Selo ausente", desc: "Falta de QR Code ou holograma oficial." },
  { title: "Acabamento frágil", desc: "Materiais leves, costuras tortas, plástico fino." },
  { title: "Tipografia errada", desc: "Logo borrado ou com fonte diferente." },
  { title: "Cheiro ou peso estranho", desc: "Cosméticos e eletrônicos têm padrão sensorial." },
];

const quiz = [
  { q: "Qual destes é o sinal mais confiável de um produto original?", o: ["Preço baixíssimo", "Selo byTrust com QR válido", "Embalagem brilhante"], a: 1 },
  { q: "Ao receber um produto sem nota fiscal você deve:", o: ["Usar normalmente", "Devolver ou verificar a origem", "Ignorar"], a: 1 },
  { q: "Cosméticos falsificados podem causar:", o: ["Apenas decepção", "Reações alérgicas e intoxicação", "Nenhum risco"], a: 1 },
];

const glossary = [
  ["Falsificação", "Produto fabricado para se passar por outro, sem autorização da marca."],
  ["Réplica", "Cópia abertamente declarada, ainda assim ilegal em muitos casos."],
  ["Código de série", "Identificador único impresso ou gravado em cada item."],
  ["QR Code", "Etiqueta visual que aponta para a verificação digital do produto."],
  ["NFC", "Chip de proximidade usado para autenticar produtos via celular."],
  ["Rastreabilidade", "Capacidade de seguir o caminho do produto da fábrica ao cliente."],
  ["Selo byTrust", "Marca de garantia digital aplicada por marcas verificadas."],
];

function LearningPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [openTerm, setOpenTerm] = useState<number | null>(0);
  const [hoverSign, setHoverSign] = useState<number | null>(null);
  const score = answers.reduce((s, a, i) => s + (a === quiz[i].a ? 1 : 0), 0);
  const done = step >= quiz.length;

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="sticker mb-6">📚 Centro educativo byTrust</div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05]">
          Aprenda a <span className="tape">identificar</span><br/> e combater a falsificação
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Conhecimento é a melhor proteção. byTrust te ajuda a se tornar um consumidor —
          ou revendedor — mais consciente.
        </p>
      </section>

      {/* Trilhas */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl mb-6 text-center">Trilhas de aprendizado</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Users, bg: "bg-blue/50", t: "Para consumidores", d: "Como evitar produtos falsos no dia a dia, usar o app byTrust e o que fazer ao receber um falsificado.", n: "12 aulas · 35 min" },
            { icon: Store, bg: "bg-tan/50", t: "Para varejistas", d: "Verifique fornecedores, integre a API ao seu estoque e treine sua equipe contra fraudes.", n: "9 aulas · 50 min" },
            { icon: Factory, bg: "bg-green/50", t: "Para fabricantes", d: "Implemente autenticação byTrust na linha de produção e ganhe rastreabilidade total.", n: "14 aulas · 1h20" },
          ].map((c) => (
            <div key={c.t} className={`card-soft ${c.bg}`}>
              <c.icon className="w-8 h-8 mb-3" />
              <h3 className="font-display text-2xl mb-2">{c.t}</h3>
              <p className="text-sm mb-4">{c.d}</p>
              <div className="text-xs font-mono uppercase tracking-wider mb-4">{c.n}</div>
              <button className="btn-pill text-sm">Começar trilha →</button>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz + Video */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div className="card-soft bg-card">
          <div className="text-tan text-xs font-mono uppercase tracking-wider mb-2">Quiz rápido</div>
          <h3 className="font-display text-2xl mb-4">Você sabe identificar um produto falso?</h3>
          {!done ? (
            <>
              <div className="text-xs font-mono mb-3">Pergunta {step + 1} de {quiz.length}</div>
              <p className="font-medium mb-4">{quiz[step].q}</p>
              <div className="flex flex-col gap-2">
                {quiz[step].o.map((opt, i) => (
                  <button key={i} onClick={() => { setAnswers([...answers, i]); setStep(step+1); }} className="text-left px-4 py-3 rounded-xl border-2 border-foreground bg-background hover:bg-tan/30 transition">
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-tan" />
              <div className="font-display text-3xl">{score} / {quiz.length}</div>
              <p className="text-sm text-muted-foreground mb-4">
                {score === quiz.length ? "Perfeito! Você é um detector de falsos." : score >= 2 ? "Quase lá — revise a trilha do consumidor." : "Hora de aprender. Comece pela trilha básica."}
              </p>
              <button onClick={() => { setStep(0); setAnswers([]); }} className="btn-pill text-sm">Refazer</button>
            </div>
          )}
        </div>

        <div className="card-soft bg-green/40">
          <div className="text-xs font-mono uppercase tracking-wider mb-2">Vídeo explicativo</div>
          <h3 className="font-display text-2xl mb-4">Como a byTrust verifica produtos em 3 segundos</h3>
          <div className="aspect-video rounded-xl border-2 border-foreground bg-foreground text-background grid place-items-center cursor-pointer hover:bg-foreground/90 transition">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-tan grid place-items-center mx-auto mb-3 text-foreground">
                <Play className="w-7 h-7 ml-1" />
              </div>
              <div className="font-mono text-xs uppercase tracking-wider">03:42 · play demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Infográfico */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl mb-2 text-center">Os 7 sinais de um produto falsificado</h2>
        <p className="text-center text-sm text-muted-foreground mb-8">Passe o mouse sobre cada sinal</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {signs.map((s, i) => (
            <div key={i} onMouseEnter={() => setHoverSign(i)} onMouseLeave={() => setHoverSign(null)}
              className={`card-soft text-center cursor-pointer ${hoverSign === i ? "bg-tan/60" : "bg-card"}`}>
              <div className="font-display text-4xl mb-2">{i+1}</div>
              <div className="font-medium text-sm">{s.title}</div>
              {hoverSign === i && <div className="text-xs mt-2 text-muted-foreground">{s.desc}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue/40 border-y-2 border-foreground py-12 my-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-center">
          {[
            { n: "30%", l: "dos falsos oferecem risco à saúde" },
            { n: "1 em 4", l: "consumidores já compraram um falso" },
            { n: "1M+", l: "produtos suspeitos identificados pela byTrust" },
          ].map((s) => (
            <div key={s.l} className="card-soft bg-card">
              <div className="font-display text-5xl">{s.n}</div>
              <div className="text-sm font-mono uppercase tracking-wider mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Glossary */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl mb-6 text-center">Glossário</h2>
        <div className="space-y-2">
          {glossary.map(([term, def], i) => (
            <div key={term} className="border-2 border-foreground rounded-xl bg-card overflow-hidden">
              <button onClick={() => setOpenTerm(openTerm === i ? null : i)}
                className="w-full px-5 py-4 flex justify-between items-center font-medium hover:bg-tan/20">
                <span>{term}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openTerm === i ? "rotate-180" : ""}`} />
              </button>
              {openTerm === i && <div className="px-5 pb-4 text-sm text-muted-foreground">{def}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-3xl mx-auto px-6 py-10 text-center">
        <div className="card-soft bg-tan/40">
          <div className="text-5xl mb-4">"</div>
          <p className="font-display text-2xl mb-4">
            Aprendi com a Learning Page da byTrust a nunca mais cair em falsificações de perfumes.
          </p>
          <div className="text-sm font-mono uppercase tracking-wider">— Marina S., consumidora</div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        <Link to="/cartilhas" className="card-soft bg-green/50 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase mb-1">Próximo passo</div>
            <div className="font-display text-2xl">Baixe nosso guia completo</div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </Link>
        <Link to="/verificador" className="card-soft bg-blue/50 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase mb-1">Pratique</div>
            <div className="font-display text-2xl">Teste o Verificador byTrust</div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </Link>
      </section>
    </PageShell>
  );
}

export { CheckCircle2, XCircle };
