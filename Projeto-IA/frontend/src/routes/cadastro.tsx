import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import {
  UserPlus,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { validarEmail, validarSenha, requisitosSenha } from "@/lib/validation";
import { cadastrarUsuario } from "@/lib/api/auth.functions";
import { authClient } from "@/lib/api/auth-client";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — byTrust" },
      {
        name: "description",
        content:
          "Crie sua conta byTrust e comece a verificar a autenticidade de produtos em tempo real.",
      },
    ],
    links: [{ rel: "canonical", href: "/cadastro" }],
  }),
  component: CadastroPage,
});

type Plano = "gratuito" | "profissional" | "enterprise";

const planos: { key: Plano; label: string; desc: string }[] = [
  { key: "gratuito", label: "Gratuito", desc: "10 verificações/mês" },
  { key: "profissional", label: "Profissional", desc: "1.000 verificações/mês" },
  { key: "enterprise", label: "Enterprise", desc: "Verificações ilimitadas" },
];

function CadastroPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [tipo, setTipo] = useState<"consumidor" | "varejista" | "marca">("consumidor");
  const [empresa, setEmpresa] = useState("");
  const [plano, setPlano] = useState<Plano>("gratuito");

  const [aceite, setAceite] = useState(false);

  const requisitos = requisitosSenha();

  const validarStep1 = () => {
    if (!nome || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos obrigatórios.");
      return false;
    }

    const emailResult = validarEmail(email);
    if (!emailResult.valido) {
      setError(emailResult.mensagem);
      return false;
    }

    const senhaResult = validarSenha(password);
    if (!senhaResult.valido) {
      setError(senhaResult.mensagem);
      return false;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const avancar = () => {
    setError("");
    if (step === 1 && !validarStep1()) return;
    setStep(step + 1);
  };

  const voltar = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aceite) {
      setError("Você precisa aceitar os termos de uso.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await cadastrarUsuario({
        data: {
          name: nome,
          email,
          password,
          profile: tipo,
          company: empresa || undefined,
          plan: plano,
        },
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
      <section className="max-w-lg mx-auto px-6 pt-16 pb-16">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80">
            <div className="w-10 h-10 rounded-full bg-foreground text-background grid place-items-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl tracking-tight">
              by<em className="text-tan">Trust</em>.
            </span>
          </Link>

          <h1 className="font-display text-4xl md:text-5xl mb-2">Criar conta</h1>
          <p className="text-sm text-muted-foreground">
            Junte-se à comunidade antifalsificação.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full border-2 grid place-items-center text-xs font-mono font-bold ${
                  s <= step
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-8 h-0.5 ${s < step ? "bg-foreground" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card-soft bg-card">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl border-2 border-destructive bg-destructive/10 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                    Nome completo
                  </label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seugmail.com, contato@outlook.com"
                    className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                  />
                  <p className="text-xs text-muted-foreground mt-1 px-2">
                    Aceitamos Gmail, Outlook, Proton, Tuta, Yahoo, iCloud e outros.
                  </p>
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
                      placeholder="Crie uma senha forte"
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

                  <div className="mt-2 space-y-1">
                    {requisitos.map((req) => {
                      const ok =
                        password.length >= 8 && req.includes("8 caracteres")
                          ? true
                          : req.includes("maiúscula")
                            ? /[A-Z]/.test(password)
                            : req.includes("minúscula")
                              ? /[a-z]/.test(password)
                              : req.includes("número")
                                ? /[0-9]/.test(password)
                                : req.includes("especial")
                                  ? /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;']/ .test(password)
                                  : false;

                      return (
                        <div
                          key={req}
                          className={`flex items-center gap-1.5 text-xs ${
                            password.length > 0
                              ? ok
                                ? "text-success"
                                : "text-muted-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {password.length > 0 && ok ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {req}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full px-4 py-3 pr-12 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      {password === confirmPassword ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          <span className="text-success">Senhas coincidem</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-destructive" />
                          <span className="text-destructive">Senhas não coincidem</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={avancar}
                  className="btn-pill-primary w-full justify-center"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                    Você é
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["consumidor", "varejista", "marca"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTipo(t)}
                        className={`px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          tipo === t
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:border-foreground"
                        }`}
                      >
                        {t === "consumidor"
                          ? "Consumidor"
                          : t === "varejista"
                            ? "Varejista"
                            : "Marca"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                    Empresa opcional
                  </label>
                  <input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Nome da sua empresa"
                    className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-tan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                    Plano
                  </label>
                  <div className="grid gap-2">
                    {planos.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setPlano(p.key)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                          plano === p.key
                            ? "border-foreground bg-tan/20"
                            : "border-border bg-background hover:border-foreground"
                        }`}
                      >
                        <div>
                          <div className="font-medium">{p.label}</div>
                          <div className="text-xs text-muted-foreground">{p.desc}</div>
                        </div>
                        {plano === p.key && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={voltar} className="btn-pill flex-1 justify-center">
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={avancar}
                    className="btn-pill-primary flex-1 justify-center"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="px-4 py-3 rounded-xl bg-muted/50">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Nome
                    </div>
                    <div className="font-medium">{nome}</div>
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-muted/50">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      E-mail
                    </div>
                    <div className="font-medium">{email}</div>
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-muted/50">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Perfil
                    </div>
                    <div className="font-medium capitalize">{tipo}</div>
                  </div>

                  {empresa && (
                    <div className="px-4 py-3 rounded-xl bg-muted/50">
                      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                        Empresa
                      </div>
                      <div className="font-medium">{empresa}</div>
                    </div>
                  )}

                  <div className="px-4 py-3 rounded-xl bg-muted/50">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Plano
                    </div>
                    <div className="font-medium capitalize">{plano}</div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceite}
                    onChange={(e) => setAceite(e.target.checked)}
                    className="w-5 h-5 mt-0.5 shrink-0 accent-foreground"
                  />
                  <span className="text-sm text-muted-foreground">
                    Aceito os{" "}
                    <Link to="/termos" target="_blank" className="underline text-foreground hover:text-tan">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link
                      to="/privacidade"
                      target="_blank"
                      className="underline text-foreground hover:text-tan"
                    >
                      Política de Privacidade
                    </Link>{" "}
                    da byTrust.
                  </span>
                </label>

                <div className="flex gap-3">
                  <button type="button" onClick={voltar} className="btn-pill flex-1 justify-center">
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-pill-primary flex-1 justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Criando
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Criar conta
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="flex justify-center gap-1.5 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  s === step ? "bg-foreground" : "bg-border"
                }`}
              />
            ))}
          </div>

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
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-foreground underline hover:text-tan">
              Fazer login
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