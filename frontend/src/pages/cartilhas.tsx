import { Download } from "lucide-react";

const items = [
  {
    t: "10 sinais de um produto falso",
    d: "Guia rápido com checklist visual para identificar falsificações no ato da compra.",
    arquivo: "10_sinais_de_um_produto_falso.pdf",
    pages: 1,
    bgCard: "bg-gold-500/10",
  },
  {
    t: "Qual o problema da falsificação?",
    d: "Impactos econômicos, riscos à saúde e consequências para consumidores e marcas.",
    arquivo: "Qual_o_problema_da_falsificação.pdf",
    pages: 1,
    bgCard: "bg-cream-200",
  },
  {
    t: "Cartilha do consumidor consciente",
    d: "Como comprar online com segurança e usar a API byTrust no dia a dia.",
    arquivo: "O_que_é_consumo_conciente.pdf",
    pages: 1,
    bgCard: "bg-emerald-500/10",
  },
  {
    t: "Onde a falsificação está presente?",
    d: "Setores mais afetados pela pirataria e como a falsificação se infiltra em diferentes mercados.",
    arquivo: "Onde_a_falsificação_está_presente.pdf",
    pages: 1,
    bgCard: "bg-cream-100",
  },
  {
    t: "Falsificações em cosméticos",
    d: "Como reconhecer perfumes, maquiagens e dermocosméticos piratas.",
    arquivo: "Falsificação_em_cosmeticos.pdf",
    pages: 1,
    bgCard: "bg-red-500/10",
  },
  {
    t: "Porque comprar original?",
    d: "Os riscos de produtos falsificados e os benefícios de escolher o original.",
    arquivo: "Porque_comprar_original.pdf",
    pages: 1,
    bgCard: "bg-gold-400/10",
  },
];

async function download(arquivo: string) {
  const res = await fetch(`/cartilhas/${arquivo}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Cartilhas() {
  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-label mb-3">📘 Cartilhas byTrust</p>
        <h1 className="display-title text-4xl md:text-6xl mb-4">
          Baixe nossos guias completos
        </h1>
        <p className="text-ink-600 max-w-2xl mx-auto">
          Material educativo gratuito para consumidores, lojistas, marcas e desenvolvedores.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.t} className={`card-hover flex flex-col ${it.bgCard}`}>
            {/* Preview da capa — mostra imagem se existir, caso contrário exibe ícone */}
            <div
              className="aspect-[3/4] rounded-xl border border-ink-200 bg-cream-50 mb-4 p-6 flex flex-col justify-between relative overflow-hidden"
              style={{
                backgroundImage: `url(/cartilhas/preview/${it.arquivo.replace(".pdf", ".jpeg")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute top-3 right-3">
                <span className="tag tag-gold text-[10px]">PDF · {it.pages}p</span>
              </div>
              <div />
              <div className="bg-cream-50/90 p-3 rounded-lg">
                <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">byTrust</div>
                <div className="font-serif font-bold text-lg text-ink-900 leading-tight">{it.t}</div>
              </div>
            </div>
            <p className="text-sm text-ink-600 mb-5 flex-1">{it.d}</p>
            <button
              type="button"
              onClick={() => download(it.arquivo)}
              className="btn-primary text-sm justify-center"
            >
              <Download className="w-4 h-4" /> Baixar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
