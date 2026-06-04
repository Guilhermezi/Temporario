import { createFileRoute, Link, useRouter, useSearch } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { useState } from "react";
import { PageShell } from "@/components/site";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import { validarSenha, requisitosSenha } from "@/lib/validation";
import { redefinirSenha } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — byTrust" },
      {
        name: "description",
        content: "Defina uma nova senha para sua conta byTrust.",
      },
    ],
    links: [{ rel: "canonical", href: "/redefinir-senha" }],
  }),
  component: RedefinirSenhaPage,
});

function RedefinirSenhaPage() {
  const router = useRouter();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const tokenParam = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const requisitos = requisitosSenha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Valida senha
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
      <PageShell>
        <section className="max-w-md mx-auto px-6 pt-16 pb-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green/50 border-2 border-foreground grid place-items-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="font-display text-4xl mb-2">Senha redefinida!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Use sua nova senha para acessar sua conta.
            </p>
            <Link
              to="/login"
              className="btn-pill-primary inline-flex items-center gap-2"
            >
              Ir para o login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

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
            Redefinir senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Escolha uma nova senha forte para sua conta.
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
                Nova senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nova senha"
                  className="w-full px-4 py-3 pr-12 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {requisitos.map((req) => {
                  const ok = password.length >= 8
                    ? req.includes("8 caracteres") ? true
                      : req.includes("maiúscula") ? /[A-Z]/.test(password)
                        : req.includes("minúscula") ? /[a-z]/.test(password)
                          : req.includes("número") ? /[0-9]/.test(password)
                            : req.includes("especial") ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : false
                    : false;
                  return (
                    <div key={req} className={`flex items-center gap-1.5 text-xs ${password.length > 0 && ok ? "text-success" : "text-muted-foreground"}`}>
                      {password.length > 0 && ok ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                      {req}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                Confirmar nova senha *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-4 py-3 pr-12 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  {password === confirmPassword ? (
                    <><CheckCircle2 className="w-3 h-3 text-success" /><span className="text-success">Senhas coincidem</span></>
                  ) : (
                    <><div className="w-3 h-3 rounded-full border border-destructive" /><span className="text-destructive">Senhas não coincidem</span></>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill-primary w-full justify-center"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redefinindo…</>
              ) : (
                <><LockKeyhole className="w-4 h-4" /> Redefinir senha</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o login
          </Link>
        </div>
      </section>
    </PageShell>
  );
}