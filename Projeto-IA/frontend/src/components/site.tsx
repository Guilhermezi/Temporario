import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShieldCheck, LogIn, User } from "lucide-react";

const links = [
  { to: "/", label: "Início" },
  { to: "/verificador", label: "Verificador" },
  { to: "/learning", label: "Learning" },
  { to: "/blog", label: "Blog" },
  { to: "/cartilhas", label: "Cartilhas" },
  { to: "/contato", label: "Contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-cream/80 border-b-2 border-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-foreground text-background grid place-items-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl tracking-tight">by<em className="text-tan">Trust</em>.</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium uppercase tracking-wide">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-tan transition-colors" activeProps={{ className: "text-tan" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide hover:text-tan transition-colors">
            <LogIn className="w-4 h-4" /> Entrar
          </Link>
          <Link to="/cadastro" className="btn-pill text-sm">
            Criar conta →
          </Link>
          <Link to="/perfil" className="w-9 h-9 rounded-full border-2 border-foreground bg-background grid place-items-center hover:bg-tan/20 transition-colors">
            <User className="w-4 h-4" />
          </Link>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t-2 border-foreground bg-cream">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 border-b border-border">
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-pill text-sm flex-1 justify-center">
                <LogIn className="w-4 h-4" /> Entrar
              </Link>
              <Link to="/cadastro" onClick={() => setOpen(false)} className="btn-pill-primary text-sm flex-1 justify-center">
                Criar conta
              </Link>
              <Link to="/perfil" onClick={() => setOpen(false)} className="btn-pill text-sm flex-1 justify-center">
                <User className="w-4 h-4" /> Perfil
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items];
  return (
    <div className="border-y-2 border-foreground bg-cream overflow-hidden py-3">
      <div className="flex gap-8 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        {row.map((t, i) => (
          <span key={i} className="text-xs uppercase tracking-[0.2em] font-mono flex items-center gap-8">
            {t} <span className="text-tan">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from {transform: translateX(0)} to {transform: translateX(-33.33%)} }`}</style>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-green/40 border-t-2 border-foreground mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-foreground text-background grid place-items-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-display text-2xl">by<em className="text-tan">Trust</em>.</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Tecnologia antipirataria. Protegendo sua confiança, produto por produto.
          </p>
          <div className="sticker mt-4">API byTrust · Tecnologia antipirataria</div>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-wider mb-3 font-mono">Navegação</h4>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-tan">{l.label}</Link></li>
            ))}
            <li className="pt-2 border-t border-border"><Link to="/login" className="hover:text-tan">Entrar</Link></li>
            <li><Link to="/cadastro" className="hover:text-tan">Criar conta</Link></li>
            <li><Link to="/perfil" className="hover:text-tan">Meu perfil</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-wider mb-3 font-mono">Contato</h4>
          <ul className="space-y-2 text-sm">
            <li>contato@bytrust.com</li>
            <li>+55 (11) 4002-8922</li>
            <li><Link to="/privacidade" className="hover:text-tan">Política de privacidade</Link></li>
            <li><Link to="/termos" className="hover:text-tan">Termos de uso</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-foreground py-4 text-center text-xs font-mono uppercase tracking-wider">
        © 2026 byTrust · Feito para combater a falsificação
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
