import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Upload, CheckCircle2, XCircle, Loader2, Share2, Trophy, Camera, X,
} from "lucide-react";
import { api, assetUrl, type Product, type VerifyResult } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { getPageCopy } from "../locales/pageCopy";

const MAX = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function Verificador() {
  const { user } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const { i18n } = useTranslation();
  const c = getPageCopy(i18n.language).verify;

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
    api.products.list()
      .then(setProducts)
      .finally(() => setProductsLoading(false));
  }, []);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!TYPES.includes(f.type)) { setErr(c.formatError); return; }
    if (f.size > MAX) { setErr(c.sizeError); return; }
    setErr("");
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const remove = () => {
    setPhoto(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const verify = async () => {
    if (!user) { nav("/login"); return; }
    if (!photo) { setErr(c.photoRequired); return; }
    if (!selectedProduct) { setErr(c.productRequired); return; }
    setErr("");
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("photo", photo);
      form.append("productId", selectedProduct);
      if (serial.trim()) form.append("serialCode", serial.trim());
      form.append("sourceType", "manual");
      setResult(await api.verifications.create(form));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setErr(msg.includes("serial") ? c.duplicate : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 fade-up">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="section-label mb-3">{c.eyebrow}</p>
        <h1 className="font-serif font-black text-5xl mb-4">{c.title}</h1>
        <p className="text-ink-500 max-w-sm mx-auto">{c.text}</p>
        {!user && (
          <p className="mt-4 text-sm text-gold-600 bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-3 inline-block">
            <button onClick={() => nav("/login")} className="underline font-semibold">
              {c.login}
            </button>{" "}
            {c.loginSuffix}
          </p>
        )}
      </div>

      {/* Form */}
      <div className="card space-y-6">

        {/* Foto */}
        <div>
          <label className="label">{c.photo}</label>
          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-52 border-2 border-dashed border-ink-300 rounded-xl flex flex-col items-center justify-center gap-3 text-ink-400 hover:border-ink-600"
            >
              <Camera size={32} />
              <span className="text-sm font-medium">{c.choosePhoto}</span>
              <span className="text-xs">{c.formats}</span>
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} className="w-full h-64 object-cover" alt="preview" />
              <button
                onClick={remove}
                className="absolute top-3 right-3 bg-ink-900/70 rounded-full p-1.5 text-cream-100"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onPhoto}
          />
        </div>

        {/* Produto */}
        <div>
          <label className="label">{c.product}</label>
          {productsLoading ? (
            <div className="input flex items-center gap-2 text-ink-400">
              <Loader2 size={14} className="animate-spin" /> {c.loadingProducts}
            </div>
          ) : (
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input"
            >
              <option value="">{c.selectProduct}</option>
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
            {c.serial}{" "}
            <span className="text-ink-400 normal-case font-normal">{c.optional}</span>
          </label>
          <input
            className="input"
            placeholder={c.serialExample}
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify()}
          />
        </div>

        {/* Erro */}
        {err && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {err}
          </div>
        )}

        {/* Botão */}
        <button
          onClick={verify}
          disabled={loading || productsLoading}
          className="btn-primary w-full justify-center py-3.5"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> {c.checking}</>
          ) : (
            <><Upload size={18} /> {c.check}</>
          )}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div className={`mt-8 rounded-2xl border-2 p-6 ${
          result.authentic ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"
        }`}>
          <div className="flex gap-4 mb-6">
            {result.authentic
              ? <CheckCircle2 size={36} className="text-emerald-600" />
              : <XCircle size={36} className="text-red-600" />
            }
            <div>
              <div className={`font-serif font-black text-2xl ${
                result.authentic ? "text-emerald-800" : "text-red-800"
              }`}>
                {result.authentic ? c.original : c.suspicious}
              </div>
              <div className="text-ink-700 text-sm mt-1">{result.message}</div>
            </div>
          </div>

          {result.authentic && result.seal && (
            <>
              <img
                src={result.seal.imageUrl}
                alt={c.sealPage}
                className="w-full rounded-xl mb-5 border"
              />
              <div className="flex gap-2 flex-wrap">
                
                  href={result.seal.shareableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-sm py-2"
                >
                  {c.sealPage}
                </a>
                
                  href={`https://twitter.com/intent/tweet?url=${result.seal.shareableUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-sm py-2"
                >
                  <Share2 size={14} /> {c.share}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(result.seal!.shareableUrl)}
                  className="btn-ghost text-sm py-2"
                >
                  {c.copy}
                </button>
              </div>
            </>
          )}

          {result.newBadges.length > 0 && (
            <div className="mt-5 p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl">
              <div className="flex items-center gap-2 font-semibold text-gold-600 mb-3">
                <Trophy size={18} /> {c.achievement}
              </div>
              {result.newBadges.map((b) => (
                <span key={b.id} className="inline-flex items-center gap-2 mr-3">
                  <img src={assetUrl(b.imageUrl)} className="w-8 h-8 rounded-full" />
                  {b.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}