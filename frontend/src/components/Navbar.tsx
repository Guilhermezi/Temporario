import { NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "INÍCIO" },
    { to: "/verificar", label: "VERIFICADOR" },
    { to: "/aprender", label: "LEARNING" },
    { to: "/feed", label: "BLOG" },
    { to: "/cartilhas", label: "CARTILHAS" },
    { to: "/contato", label: "CONTATO" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-cream-100/90 backdrop-blur-md border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-full bg-ink-900 flex items-center justify-center">
            <ShieldCheck size={16} className="text-cream-100" />
          </div>

          <span className="font-serif font-bold text-lg text-ink-900 leading-none">
            by
            <em className="not-italic text-gold-500">Trust</em>
            <span className="text-gold-500">.</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors ${
                  isActive
                    ? "text-gold-500"
                    : "text-ink-700 hover:text-ink-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-ink-900 text-cream-100"
                      : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
                  }`
                }
              >
                <User size={16} />
                {user.displayName ?? user.username}
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2 rounded-full text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                aria-label="Sair"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors"
              >
                <LogOut size={16} className="rotate-180" />
                ENTRAR
              </button>

              <button
                onClick={() => navigate("/login")}
                className="btn-outline text-sm py-2 px-5"
              >
                Criar conta →
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-10 h-10 rounded-full border border-ink-400 flex items-center justify-center hover:bg-ink-100 transition-colors"
                aria-label="Perfil"
              >
                <User size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-ink-200 overflow-x-auto">
        <div className="flex min-w-max">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-gold-500"
                    : "text-ink-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to={user ? "/perfil" : "/login"}
            className={({ isActive }) =>
              `px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "text-gold-500"
                  : "text-ink-600"
              }`
            }
          >
            {user ? (user.displayName ?? user.username) : "ENTRAR"}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}