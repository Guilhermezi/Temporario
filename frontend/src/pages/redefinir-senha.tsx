import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { validarSenha, requisitosSenha } from "../lib/validation";
import { redefinirSenha } from "../lib/api/auth.functions";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const requisitos = requisitosSenha();

  const checaRequisito = (req: string, pwd: string): boolean => {
    if (req.includes("6 caracteres")) return pwd.length >= 6;
    if (req.includes("letra")) return /[A-Za-z]/.test(pwd);
    if (req.includes("número")) return /[0-9]/.test(pwd);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Valida senha usando a lib de validação do projeto de referência
    const senhaResult = validarSenha(password);
    if (!senhaResult.valido) {
      setError(senhaResult.mensagem);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const result = await redefinirSenha({
        data: { token: tokenParam, password },
      });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen fade-up pt-24 pb-16 px-5">
        <div className="max-w-md mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 grid place-items-center mx-auto mb-6">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="display-title text-3xl mb-2">Senha redefinida!</h1>
          <p className="text-sm text-ink-600 mb-6">
            Sua senha foi alterada com sucesso. Use sua nova senha para acessar sua conta.
          </p>
          <button onClick={() => navigate("/login")} className="btn-primary inline-flex">
            Ir para o login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="display-title text-3xl md:text-4xl mb-2">Redefinir senha</h1>
          <p className="text-sm text-ink-600">Escolha uma nova senha forte para sua conta.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="label">Nova senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nova senha"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {requisitos.map((req) => {
                  const ok = password.length > 0 && checaRequisito(req, password);
                  return (
                    <div
                      key={req}
                      className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-600" : "text-ink-500"}`}
                    >
                      {ok ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      {req}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label">Confirmar nova senha *</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  {password === confirmPassword ? (
                    <><CheckCircle2 className="w-3 h-3 text-emerald-600" /><span className="text-emerald-600">Senhas coincidem</span></>
                  ) : (
                    <><div className="w-3 h-3 rounded-full border border-red-500" /><span className="text-red-600">Senhas não coincidem</span></>
                  )}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redefinindo…</>
              ) : (
                <><LockKeyhole className="w-4 h-4" /> Redefinir senha</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
