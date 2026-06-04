import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import { X, Calendar, Tag } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog byTrust — Falsificação, riscos e tecnologia" },
      { name: "description", content: "Artigos sobre os riscos da falsificação, prejuízos econômicos e como a API byTrust resolve o problema." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const posts = [
  {
    cat: "Saúde",
    color: "bg-destructive/20",
    title: "Cosméticos e remédios falsos: o risco que entra na sua pele",
    date: "28 mai 2026",
    summary: "Produtos falsificados podem conter metais pesados, princípios ativos errados e doses tóxicas. Veja como se proteger.",
    body: "Estudos da Anvisa mostram que até 30% dos cosméticos vendidos em marketplaces sem verificação contêm substâncias proibidas. Em remédios, a situação é ainda mais grave: doses incorretas podem mascarar sintomas e atrasar tratamentos críticos. A byTrust trabalha com fabricantes farmacêuticos e de beleza para gerar QR codes únicos em cada lote, validados em tempo real pela API. Quando um consumidor escaneia o código, recebe um histórico completo: fábrica de origem, data de produção, lote e validade. Se algo não bate, o alerta é imediato.",
  },
  {
    cat: "Economia",
    color: "bg-tan/40",
    title: "Pirataria custa R$ 460 bilhões por ano ao Brasil",
    date: "21 mai 2026",
    summary: "O comércio ilegal corrói arrecadação, empregos e marcas inteiras. Entenda o tamanho do problema.",
    body: "Dados do Fórum Nacional Contra Pirataria estimam que a indústria brasileira perde R$ 460 bilhões anuais para produtos falsificados. Isso significa empregos formais que deixaram de ser criados, impostos não arrecadados e o enfraquecimento de marcas legítimas. Pequenos e médios produtores são os mais afetados — sem recursos para combater redes de falsificação, muitos fecham as portas. Tecnologias de autenticação como a API byTrust nivelam o jogo: por uma fração do custo de uma campanha tradicional, qualquer marca passa a ter rastreabilidade de nível enterprise.",
  },
  {
    cat: "Tecnologia",
    color: "bg-blue/50",
    title: "Como a API byTrust verifica milhões de produtos em milissegundos",
    date: "14 mai 2026",
    summary: "Por baixo do capô: arquitetura distribuída, hashes criptográficos e validação em tempo real.",
    body: "A API byTrust roda em uma arquitetura serverless distribuída em três continentes. Cada produto cadastrado recebe um hash criptográfico único, ancorado em ledger imutável. Quando um QR Code é escaneado, a requisição é roteada para o nó mais próximo do consumidor — média de resposta abaixo de 200ms. O sistema cruza assinatura digital, geolocalização e histórico de scans para detectar padrões suspeitos (mesmo código sendo escaneado em estados diferentes na mesma semana, por exemplo). Tudo isso disponível em uma única chamada REST.",
  },
  {
    cat: "Eletrônicos",
    color: "bg-green/50",
    title: "Carregadores falsos: por que esse mercado é perigoso",
    date: "07 mai 2026",
    summary: "Mais de 60% dos carregadores 'genéricos' falham em testes básicos de segurança elétrica.",
    body: "Carregadores e baterias falsificados são responsáveis por milhares de incêndios domésticos por ano. Falta de isolamento, componentes superdimensionados e ausência de proteção contra sobrecarga são problemas comuns. A byTrust mantém um banco de IMEIs e códigos de acessórios oficiais das principais marcas — basta uma leitura para saber se o item é genuíno.",
  },
  {
    cat: "Varejo",
    color: "bg-card",
    title: "Checklist do lojista: como blindar seu estoque contra falsificações",
    date: "30 abr 2026",
    summary: "Seis passos práticos para garantir que tudo que entra na sua loja é original.",
    body: "1) Exija nota fiscal de toda compra. 2) Cadastre fornecedores na plataforma byTrust e verifique reputação. 3) Use o app de inventário para escanear cada item no recebimento. 4) Treine sua equipe a reconhecer sinais físicos. 5) Crie um protocolo de devolução para itens suspeitos. 6) Comunique seus clientes que sua loja é verificada — confiança vira venda.",
  },
  {
    cat: "Marcas",
    color: "bg-tan/30",
    title: "Por que rastreabilidade virou estratégia de marketing",
    date: "22 abr 2026",
    summary: "Marcas que abraçam a verificação ganham percepção de valor, lealdade e dados.",
    body: "Consumidores Gen Z e millennials valorizam transparência. Quando uma marca permite escanear o produto para ver origem, fabricação e cadeia logística, ela está vendendo confiança junto com o item. Os dados gerados por cada scan também alimentam estratégias de CRM e antifraude.",
  },
];

function Blog() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="sticker mb-6">Blog byTrust</div>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">
          Histórias e dados sobre <span className="tape">falsificação</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Educação, alerta e tecnologia. Conteúdo para quem quer entender — e combater — o mercado pirata.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article key={i} className={`card-soft ${p.color} flex flex-col`}>
              <div className="aspect-[4/3] rounded-xl border-2 border-foreground bg-foreground/5 mb-4 grid place-items-center">
                <span className="font-display text-7xl opacity-30">{p.cat[0]}</span>
              </div>
              <div className="flex gap-3 text-xs font-mono uppercase tracking-wider mb-2 text-muted-foreground">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3"/>{p.cat}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{p.date}</span>
              </div>
              <h3 className="font-display text-2xl mb-2 leading-tight">{p.title}</h3>
              <p className="text-sm text-foreground/80 mb-4 flex-1">{p.summary}</p>
              <button onClick={() => setOpen(i)} className="btn-pill text-sm self-start">Ler mais →</button>
            </article>
          ))}
        </div>
      </section>

      {open !== null && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div className="bg-card max-w-2xl w-full rounded-2xl border-2 border-foreground p-8 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="sticker">{posts[open].cat}</div>
              <button onClick={() => setOpen(null)} className="p-2 rounded-full border-2 border-foreground hover:bg-tan/30"><X className="w-4 h-4"/></button>
            </div>
            <h2 className="font-display text-3xl mb-2">{posts[open].title}</h2>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-5">{posts[open].date}</div>
            <p className="text-base leading-relaxed whitespace-pre-line">{posts[open].body}</p>
          </div>
        </div>
      )}
    </PageShell>
  );
}
