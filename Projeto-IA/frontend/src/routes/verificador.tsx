import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import { CheckCircle2, XCircle, AlertTriangle, QrCode, Upload, Code2, ArrowRight, Loader2, Database } from "lucide-react";
import { verificarProduto, seedProdutosDemo } from "@/lib/api/verification.functions";

export const Route = createFileRoute("/verificador")({
  head: () => ({
    meta: [
      { title: "Verificador byTrust — API de autenticidade" },
      { name: "description", content: "Verifique a originalidade de qualquer produto byTrust por código, QR ou foto." },
    ],
    links: [{ rel: "canonical", href: "/verificador" }],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const [result, setResult] = useState<{
    status: string;
    message: string;
    detail: {
      brand: string;
      productName: string;
      batch: string | null;
      manufacturingDate: string | null;
      expiryDate: string | null;
      verifiedAt: string;
    } | null;
  } | null>(null);

  const statusTitle = (s: string) => {
    if (s === "ORIGINAL") return { title: "Produto ORIGINAL", color: "bg-green/60", icon: CheckCircle2 };
    if (s === "SUSPECT") return { title: "Produto SUSPEITO", color: "bg-tan/60", icon: AlertTriangle };
    if (s === "NOT_FOUND") return { title: "NÃO ENCONTRADO", color: "bg-destructive/20", icon: XCircle };
    return { title: "Erro na verificação", color: "bg-destructive/10", icon: XCircle };
  };

  const verify = async (override?: string) => {
    const c = (override ?? code).trim();
    if (!c) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await verificarProduto({
        data: { serialCode: c, scanType: "manual" },
      });
      setResult(response);
    } catch {
      setResult({
        status: "ERROR",
        message: "Erro de conexão com o servidor. Tente novamente.",
        detail: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const result = await seedProdutosDemo();
      setSeedMsg(result.success ? "✅ " + result.message : "ℹ️ " + result.message);
    } catch {
      setSeedMsg("❌ Erro ao criar dados de demonstração.");
    } finally {
      setSeeding(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    const st = statusTitle(result.status);
    const Icon = st.icon;
    return (
      <div className={`mt-6 p-6 rounded-2xl border-2 border-foreground ${st.color}`}>
        <div className="flex items-start gap-4">
          <Icon className={`w-10 h-10 shrink-0 ${result.status === "NOT_FOUND" ? "text-destructive" : ""}`} />
          <div className="flex-1">
            <div className="font-display text-2xl">{st.title}</div>
            <p className="text-sm mt-1">{result.message}</p>
            {result.detail && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><span className="font-mono text-muted-foreground">Marca:</span> {result.detail.brand}</div>
                <div><span className="font-mono text-muted-foreground">Produto:</span> {result.detail.productName}</div>
                {result.detail.batch && <div><span className="font-mono text-muted-foreground">Lote:</span> {result.detail.batch}</div>}
                {result.detail.manufacturingDate && (
                  <div><span className="font-mono text-muted-foreground">Fabricação:</span> {new Date(result.detail.manufacturingDate).toLocaleDateString("pt-BR")}</div>
                )}
                {result.detail.expiryDate && (
                  <div><span className="font-mono text-muted-foreground">Validade:</span> {new Date(result.detail.expiryDate).toLocaleDateString("pt-BR")}</div>
                )}
                <div className="col-span-2 mt-1 text-muted-foreground">
                  Verificado em: {new Date(result.detail.verifiedAt).toLocaleString("pt-BR")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="sticker mb-6">API · v2.4 · tempo real</div>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">
          Verificador <span className="tape">byTrust</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Insira um código de série, escaneie um QR ou envie uma foto. Em segundos confirmamos
          se o produto é <strong>original</strong> ou <strong>falsificado</strong>.
        </p>
        <p className="mt-3 text-xs font-mono text-muted-foreground">
          💡 Dica de demo: use o código <span className="px-2 py-0.5 bg-green/40 rounded">123456</span> para um resultado válido.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="card-soft bg-card">
          <label className="block text-xs font-mono uppercase tracking-wider mb-2">Código de série / Número do produto</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              placeholder="Ex.: 123456"
              className="flex-1 px-4 py-3 rounded-full border-2 border-foreground bg-background font-mono focus:outline-none focus:ring-2 focus:ring-tan"
            />
            <button onClick={() => verify()} disabled={loading} className="btn-pill-primary justify-center">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Verificando…</> : <>Verificar originalidade <ArrowRight className="w-4 h-4"/></>}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <button onClick={() => verify("123456")} className="card-soft bg-blue/40 text-left">
              <QrCode className="w-7 h-7 mb-2" />
              <div className="font-display text-xl">Escanear QR Code</div>
              <div className="text-sm text-muted-foreground">Simulação · usa código de demo</div>
            </button>
            <button onClick={() => verify("FAKE-001")} className="card-soft bg-tan/40 text-left">
              <Upload className="w-7 h-7 mb-2" />
              <div className="font-display text-xl">Enviar foto do produto</div>
              <div className="text-sm text-muted-foreground">Simulação · resposta instantânea</div>
            </button>
          </div>

          {renderResult()}

          <div className="mt-4">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="btn-pill text-sm justify-center w-full"
            >
              <Database className="w-4 h-4" />
              {seeding ? "Populando banco…" : "Carregar produtos de demonstração no banco"}
            </button>
            {seedMsg && (
              <p className="text-xs text-center mt-2 text-muted-foreground">{seedMsg}</p>
            )}
          </div>
        </div>
      </section>

      {/* API for companies */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-tan text-sm font-mono uppercase tracking-wider mb-3">Para empresas</div>
          <h2 className="font-display text-4xl mb-4">Integre a API byTrust em minutos.</h2>
          <p className="text-muted-foreground mb-6">
            Uma única chamada REST conecta seu estoque, e-commerce ou app de campo ao maior banco
            de autenticidade do Brasil.
          </p>
          <Link to="/contato" className="btn-pill"><Code2 className="w-4 h-4"/> Ver documentação</Link>
        </div>
        <pre className="card-soft bg-foreground text-background text-xs overflow-x-auto">
{`POST https://api.bytrust.com/v2/verify
Authorization: Bearer YOUR_KEY

{
  "serial": "123456",
  "scan_type": "qr"
}

→ 200 OK
{
  "status": "ORIGINAL",
  "brand": "Acme",
  "verified_at": "2026-06-03T10:24:11Z"
}`}
        </pre>
      </section>
    </PageShell>
  );
}