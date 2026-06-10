import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Share2,
  Trophy,
  Camera,
  X,
} from "lucide-react";
import { api, assetUrl, type Product, type VerifyResult } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function Verificador() {
  const { user } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [serial, setSerial] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.products
      .list()
      .then(setProducts)
      .catch((e: Error) => console.error("[Verificador] erro ao carregar produtos:", e.message))
      .finally(() => setProductsLoading(false));
  }, []);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) { setErr("Formato não suportado. Use JPG, PNG ou WEBP."); return; }
    if (f.size > MAX_FILE_SIZE) { setErr("A imagem deve ter no máximo 10 MB."); return; }
    setErr(""); setPhoto(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };

  const removePhoto = () => {
    setPhoto(null); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const verify = async () => {
    if (!user) { nav("/login"); return; }
    if (!photo) { setErr("Selecione uma foto do produto."); return; }
    if (!selectedProduct) { setErr("Selecione o produto."); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const form = new FormData();
      form.append("photo", photo);
      form.append("productId", selectedProduct);
      if (serial.trim()) form.append("serialCode", serial.trim());
      form.append("sourceType", "manual");
      const r = await api.verifications.create(form);
      setResult(r);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      setErr(
        msg === "Você já verificou este produto com este código serial"
          ? "Você já verificou este produto com este serial. Tente um código diferente."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="section-label mb-3">Autenticidade em tempo real</p>
        <h1 className="font-serif font-black text-5xl text-ink-900 mb-4">
          Verificar produto
        </h1>
        <p className="text-ink-500 max-w-sm mx-auto leading-relaxed">
          Tire uma foto, escolha o produto e confirme a autenticidade em segundos.
        </p>
        {!user && (
          <p className="mt-4 text-sm text-gold-600 bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-3 inline-block">
            <button onClick={() => nav("/login")} className="underline font-semibold">
              Entre na sua conta
            </button>{" "}
            para verificar e receber selos.
          </p>
        )}
      </div>

      <div className="card space-y-6">
        {/* Upload de foto */}
        <div>
          <label className="label">Foto do produto *</label>
          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-52 border-2 border-dashed border-ink-300 rounded-xl flex flex-col items-center justify-center gap-3 text-ink-400 hover:border-ink-600 hover:text-ink-700 transition-all duration-150 bg-cream-100/50 group"
            >
              <Camera size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Clique para selecionar uma foto</span>
              <span className="text-xs text-ink-300">JPG, PNG ou WEBP · máx. 10 MB</span>
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} className="w-full h-64 object-cover" alt="preview" />
              <button
                onClick={removePhoto}
                className="absolute top-3 right-3 bg-ink-900/70 backdrop-blur rounded-full p-1.5 text-cream-100 hover:bg-ink-900 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPhoto} />
        </div>

        {/* Produto */}
        <div>
          <label className="label">Produto *</label>
          {productsLoading ? (
            <div className="input flex items-center gap-2 text-ink-400">
              <Loader2 size={14} className="animate-spin" /> Carregando produtos…
            </div>
          ) : (
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input appearance-none cursor-pointer"
            >
              <option value="">Selecione o produto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand.name} — {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Serial */}
        <div>
          <label className="label">
            Código serial{" "}
            <span className="text-ink-400 normal-case font-normal">(opcional)</span>
          </label>
          <input
            className="input"
            placeholder="Ex.: ABC12345"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify()}
          />
        </div>

        {err && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {err}
          </div>
        )}

        <button
          onClick={verify}
          disabled={loading || productsLoading}
          className="btn-primary w-full justify-center py-3.5 text-base"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Verificando…</>
          ) : (
            <><Upload size={18} /> Verificar autenticidade</>
          )}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div
          className={`mt-8 rounded-2xl border-2 p-6 ${
            result.authentic
              ? "border-emerald-300 bg-emerald-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-4 mb-6">
            {result.authentic ? (
              <CheckCircle2 size={36} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={36} className="text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className={`font-serif font-black text-2xl ${result.authentic ? "text-emerald-800" : "text-red-800"}`}>
                {result.authentic ? "Produto Original ✓" : "Produto Suspeito ✗"}
              </div>
              <div className="text-ink-700 text-sm mt-1 leading-relaxed">{result.message}</div>
            </div>
          </div>

          {result.authentic && result.seal && (
            <>
              <img
                src={result.seal.imageUrl}
                alt="Selo gerado"
                className="w-full rounded-xl mb-5 border border-ink-200"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="flex gap-2 flex-wrap">
                <a href={result.seal.shareableUrl} target="_blank" rel="noreferrer" className="btn-ghost text-sm py-2">
                  Ver página do selo
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=Acabei de verificar meu produto com @byTrust! ✅&url=${result.seal.shareableUrl}`}
                  target="_blank" rel="noreferrer"
                  className="btn-ghost text-sm py-2"
                >
                  <Share2 size={14} /> Compartilhar
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(result.seal!.shareableUrl)}
                  className="btn-ghost text-sm py-2"
                >
                  Copiar link
                </button>
              </div>
            </>
          )}

          {result.newBadges.length > 0 && (
            <div className="mt-5 p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl">
              <div className="flex items-center gap-2 font-semibold text-gold-600 mb-3">
                <Trophy size={18} /> Nova conquista desbloqueada!
              </div>
              <div className="flex gap-3 flex-wrap">
                {result.newBadges.map((b) => (
                  <div key={b.id} className="flex items-center gap-2 text-sm">
                    <img
                      src={assetUrl(b.imageUrl)}
                      className="w-8 h-8 rounded-full border border-gold-500/30"
                      alt={b.name}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className="text-ink-800 font-medium">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
