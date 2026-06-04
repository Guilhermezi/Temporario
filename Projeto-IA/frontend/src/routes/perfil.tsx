import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  User2,
  Mail,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu Perfil — byTrust" },
      { name: "description", content: "Gerencie sua conta byTrust." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <PageShell>
        <section className="max-w-md mx-auto px-6 pt-16 pb-20 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Carregando perfil...</p>
        </section>
      </PageShell>
    );
  }

  return user ? <Dashboard /> : <AuthWall />;
}

function AuthWall() {
  const { login, registrar, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");

    try {
      if (mode === "login") {
        await login(form.email, form.senha);
      } else {
        await registrar(form.nome, form.email, form.senha);
      }
    } catch (err: any) {
      setError(err.message ?? "Erro ao autenticar");
    }
  };

  return (
    <PageShell>
      <section className="max-w-md mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-full bg-foreground text-background items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display text-4xl">
            {mode === "login" ? "Entrar na byTrust" : "Criar conta"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {mode === "login"
              ? "Acesse sua conta e continue verificando produtos."
              : "Junte-se ao movimento antifalsificação."}
          </p>
        </div>

        <div className="card-soft bg-card space-y-4">
          {mode === "cadastro" && (
            <Field
              label="Nome completo"
              placeholder="Ex.: Guilherme Oliveira"
              value={form.nome}
              onChange={set("nome")}
            />
          )}

          <Field
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={set("email")}
          />

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.senha}
                onChange={set("senha")}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-mono focus:outline-none focus:ring-2 focus:ring-tan pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === "cadastro" && (
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo 6 caracteres com letras e números.
              </p>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="btn-pill-primary w-full justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Aguarde...
              </>
            ) : mode === "login" ? (
              <>
                Entrar <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Criar conta <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <button
                  onClick={() => {
                    setMode("cadastro");
                    setError("");
                  }}
                  className="underline underline-offset-4"
                >
                  Cadastre-se grátis
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="underline underline-offset-4"
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function Field(props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { label, ...rest } = props;

  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-background font-mono focus:outline-none focus:ring-2 focus:ring-tan"
        {...rest}
      />
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <PageShell>
      <section className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-foreground text-background grid place-items-center font-display text-2xl">
              {user?.nome?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="font-display text-3xl">{user?.nome}</h1>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                  user?.role === "ADMIN"
                    ? "border-tan bg-tan/20 text-tan"
                    : "border-border text-muted-foreground"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-3 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <InfoCard icon={<User2 className="w-5 h-5" />} label="Nome" value={user?.nome ?? ""} />
          <InfoCard icon={<Mail className="w-5 h-5" />} label="E-mail" value={user?.email ?? ""} />
          <InfoCard
            icon={<Shield className="w-5 h-5" />}
            label="Nível"
            value={user?.role === "ADMIN" ? "Administrador" : "Usuário"}
            highlight={user?.role === "ADMIN"}
          />
        </div>

        <div className="card-soft bg-green/30 text-center">
          <ShieldCheck className="w-10 h-10 mx-auto mb-3" />
          <h2 className="font-display text-2xl mb-2">Pronto para verificar?</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Use o verificador byTrust para autenticar seus produtos e combater a falsificação.
          </p>
          <Link to="/verificador" className="btn-pill-primary inline-flex">
            Verificar produto agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function InfoCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card-soft ${highlight ? "bg-tan/20" : "bg-card"}`}>
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-mono uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-medium text-sm truncate">{value}</div>
    </div>
  );
}