import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { validarEmail } from "../lib/validation";
import { solicitarRedefinicaoSenha } from "../lib/api/auth.functions";

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Valida e-mail usando a lib de validação do projeto de referência
    const emailResult = validarEmail(email);
    if (!emailResult.valido) {
      setError(emailResult.mensagem);
      return;
    }

    setLoading(true);
    try {
      const result = await solicitarRedefinicaoSenha({ data: { email } });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      setError("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="display-title text-3xl md:text-4xl mb-2">Esqueci minha senha</h1>
          <p className="text-sm text-ink-600">
            Sem problemas. Te enviamos um link para redefinir sua senha.
          </p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 grid place-items-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="font-serif font-bold text-xl text-ink-900">E-mail enviado!</h2>
              <p className="text-sm text-ink-600">
                Enviamos um link de redefinição para <strong className="text-ink-900">{email}</strong>.
              </p>
              <div className="bg-cream-50 border border-ink-200 rounded-xl px-4 py-3 text-xs text-ink-600 text-left">
                <p className="mb-1 font-semibold text-ink-900">⏱ O link expira em 30 minutos.</p>
                <p>Não recebeu? Verifique sua caixa de spam ou lixo eletrônico. Se o problema persistir, solicite um novo link abaixo.</p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => { setSent(false); setError(""); }}
                  disabled={loading}
                  className="btn-outline justify-center"
                >
                  Reenviar e-mail
                </button>
                <Link to="/login" className="text-sm text-ink-500 underline hover:text-gold-500">
                  Voltar para o login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="label">E-mail cadastrado</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input"
                />
                <p className="text-xs text-ink-500 mt-1">Insira o e-mail associado à sua conta.</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
                ) : (
                  <><Mail className="w-4 h-4" /> Enviar link de redefinição</>
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-ink-500 underline hover:text-gold-500">
                  Lembrou sua senha? Faça login
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
}
