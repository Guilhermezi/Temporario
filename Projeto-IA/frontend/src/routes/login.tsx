import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import {
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { validarEmail, validarSenha } from "@/lib/validation";
import { loginUsuario } from "@/lib/api/auth.functions";
import { authClient } from "@/lib/api/auth-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — byTrust" },
      {
        name: "description",
        content:
          "Acesse sua conta byTrust para gerenciar verificações, integrações e muito mais.",
      },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailResult = validarEmail(email);
    if (!emailResult.valido) {
      setError(emailResult.mensagem);
      return;
    }

    const senhaResult = validarSenha(password);
    if (!senhaResult.valido) {
      setError(senhaResult.mensagem);
      return;
    }

    setLoading(true);

    try {
      const result = await loginUsuario({
        data: { email, password },
      });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.token) {
        authClient.setToken(result.token);
      }

      router.navigate({ to: "/perfil" });
    } catch {
      setError("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="max-w-md mx-auto px-6 pt-16 pb-16">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80">
            <div className="w-10 h-10 rounded-full bg-foreground text-background grid place-items-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl tracking-tight">
              by<em className="text-tan">Trust</em>.
            </span>
          </Link>

          <h1 className="font-display text-4xl md:text-5xl mb-2">Entrar</h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para gerenciar verificações e integrações.
          </p>
        </div>

        <div className="card-soft bg-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl border-2 border-destructive bg-destructive/10 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail.com"
                className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pr-12 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-foreground" />
                <span className="text-muted-foreground">Lembrar de mim</span>
              </label>

              <Link to="/esqueci-senha" className="text-foreground underline hover:text-tan">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground font-mono uppercase tracking-wider">
                ou
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-medium text-foreground underline hover:text-tan">
              Criar conta
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Voltar para o início
          </Link>
        </div>
      </section>
    </PageShell>
  );
}