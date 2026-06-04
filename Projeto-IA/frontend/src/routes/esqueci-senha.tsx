import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import {
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { validarEmail } from "@/lib/validation";
import { solicitarRedefinicaoSenha } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({
    meta: [
      { title: "Esqueci minha senha — byTrust" },
      {
        name: "description",
        content:
          "Recupere o acesso à sua conta byTrust. Enviamos um link de redefinição de senha para seu e-mail.",
      },
    ],
    links: [{ rel: "canonical", href: "/esqueci-senha" }],
  }),
  component: EsqueciSenhaPage,
});

function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Valida e-mail
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
    <PageShell>
      <section className="max-w-md mx-auto px-6 pt-16 pb-16">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-full bg-foreground text-background grid place-items-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl tracking-tight">
              by<em className="text-tan">Trust</em>.
            </span>
          </Link>
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            Esqueci minha senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Sem problemas. Te enviamos um link para redefinir sua senha.
          </p>
        </div>

        <div className="card-soft bg-card">
          {sent ? (
            /* Estado de e-mail enviado */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green/50 border-2 border-foreground grid place-items-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="font-display text-2xl">E-mail enviado!</h2>
              <p className="text-sm text-muted-foreground">
                Enviamos um link de redefinição para{" "}
                <strong className="text-foreground">{email}</strong>.
              </p>
              <div className="bg-muted/50 rounded-xl px-4 py-3 text-xs text-muted-foreground text-left">
                <p className="mb-1 font-medium text-foreground">
                  ⏱ O link expira em 30 minutos.
                </p>
                <p>
                  Não recebeu? Verifique sua caixa de spam ou lixo eletrônico.
                  Se o problema persistir, solicite um novo link abaixo.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setSent(false);
                    setError("");
                  }}
                  disabled={loading}
                  className="btn-pill text-sm justify-center"
                >
                  Reenviar e-mail
                </button>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground underline hover:text-tan"
                >
                  Voltar para o login
                </Link>
              </div>
            </div>
          ) : (
            /* Formulário de solicitação */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl border-2 border-destructive bg-destructive/10 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                  E-mail cadastrado
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                />
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  Insira o e-mail associado à sua conta.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pill-primary w-full justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Enviando…
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" /> Enviar link de redefinição
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground underline hover:text-tan"
                >
                  Lembrou sua senha? Faça login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Voltar */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o início
          </Link>
        </div>
      </section>
    </PageShell>
  );
}