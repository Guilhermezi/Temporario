import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/cartilhas")({
  head: () => ({
    meta: [
      { title: "Cartilhas byTrust — Guias em PDF" },
      { name: "description", content: "Baixe guias e cartilhas educativas byTrust sobre autenticidade de produtos." },
    ],
    links: [{ rel: "canonical", href: "/cartilhas" }],
  }),
  component: CartilhasPage,
});

const items = [
  { t: "10 sinais de um produto falso", d: "Guia rápido com checklist visual para identificar falsificações no ato da compra.", pages: 12, bg: "bg-tan/50" },
  { t: "Guia do varejista contra falsificações", d: "Procedimentos para receber, conferir e bloquear fornecedores suspeitos.", pages: 24, bg: "bg-blue/50" },
  { t: "Cartilha do consumidor consciente", d: "Como comprar online com segurança e usar a API byTrust no dia a dia.", pages: 16, bg: "bg-green/50" },
  { t: "Manual técnico da API byTrust", d: "Para desenvolvedores: endpoints, autenticação, webhooks e exemplos.", pages: 38, bg: "bg-card" },
  { t: "Falsificações em cosméticos", d: "Como reconhecer perfumes, maquiagens e dermocosméticos piratas.", pages: 18, bg: "bg-destructive/20" },
  { t: "Eletrônicos originais: o passo a passo", d: "Carregadores, fones e acessórios — o que checar antes de comprar.", pages: 14, bg: "bg-tan/30" },
];

function fakeDownload(name: string) {
  const blob = new Blob([`Cartilha byTrust: ${name}\n\nEste é um PDF simulado para demonstração.`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function CartilhasPage() {
  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="sticker mb-6">📘 Cartilhas byTrust</div>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">
          Baixe nossos <span className="tape">guias completos</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Material educativo gratuito para consumidores, lojistas, marcas e desenvolvedores.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.t} className={`card-soft ${it.bg} flex flex-col`}>
              <div className="aspect-[3/4] rounded-xl border-2 border-foreground bg-card mb-4 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3 sticker text-[10px]">PDF · {it.pages}p</div>
                <FileText className="w-12 h-12 opacity-30" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider mb-2 text-muted-foreground">byTrust</div>
                  <div className="font-display text-xl leading-tight">{it.t}</div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mb-4 flex-1">{it.d}</p>
              <button onClick={() => fakeDownload(it.t)} className="btn-pill-primary text-sm justify-center">
                <Download className="w-4 h-4" /> Baixar PDF
              </button>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
