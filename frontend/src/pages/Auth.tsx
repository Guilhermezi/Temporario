import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Auth() {
  const { user, login, register, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ email: "", username: "", password: "", displayName: "" });

  useEffect(() => {
    if (user) nav("/verificar", { replace: true });
  }, [user, nav]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    try {
      if (mode === "login") {
        await login(f.email, f.password);
      } else {
        if (!f.username.trim()) { setErr("Username é obrigatório."); return; }
        if (f.password.length < 8) { setErr("A senha deve ter pelo menos 8 caracteres."); return; }
        await register(f.email, f.username, f.password, f.displayName || undefined);
      }
      nav("/verificar", { replace: true });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro desconhecido");
    }
  };

  return (
    <div className="min-h-screen flex fade-up">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-ink-900 p-12 text-cream-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center">
            <ShieldCheck size={16} className="text-ink-900" />
          </div>
          <span className="font-serif font-bold text-lg">
            by<em className="not-italic text-gold-400">Trust</em><span className="text-gold-400">.</span>
          </span>
        </div>

        <div>
          <h2 className="font-serif font-black text-4xl leading-tight mb-4">
            Protegendo sua<br /><em>confiança,</em><br />produto por produto
          </h2>
          <p className="text-cream-300 text-sm leading-relaxed">
            Junte-se à comunidade antifalsificação. Verifique, colecione selos e inspire outras pessoas.
          </p>
        </div>

        <div className="stamp text-cream-200 border-cream-300">
          Onde a autenticidade vira certeza.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="section-label mb-2">
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </p>
            <h1 className="font-serif font-black text-3xl text-ink-900">
              {mode === "login" ? "Entrar na byTrust" : "Criar conta"}
            </h1>
            <p className="text-ink-500 text-sm mt-2">
              {mode === "login" ? "Continue verificando produtos." : "Junte-se ao movimento."}
            </p>
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <>
                <Field label="Nome" placeholder="Seu nome" value={f.displayName} onChange={set("displayName")} />
                <Field label="Username *" placeholder="seunome" value={f.username} onChange={set("username")} />
              </>
            )}

            <Field
              label="E-mail *"
              type="email"
              placeholder="email@exemplo.com"
              value={f.email}
              onChange={set("email")}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />

            <div>
              <label className="label">Senha *</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={f.password}
                  onChange={set("password")}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="••••••••"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
                  aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === "login" && (
                <div className="text-right mt-1">
                  <Link to="/esqueci-senha" className="text-xs text-ink-500 hover:text-gold-500 underline">
                    Esqueci minha senha
                  </Link>
                </div>
              )}
            </div>

            {err && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {err}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Aguarde…</>
              ) : mode === "login" ? (
                "Entrar →"
              ) : (
                "Criar conta →"
              )}
            </button>

            <p className="text-center text-sm text-ink-500">
              {mode === "login" ? (
                <>
                  Não tem conta?{" "}
                  <button onClick={() => { setMode("register"); setErr(""); }} className="text-ink-900 font-semibold hover:underline">
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <button onClick={() => { setMode("login"); setErr(""); }} className="text-ink-900 font-semibold hover:underline">
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field(props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...rest} />
    </div>
  );
}
