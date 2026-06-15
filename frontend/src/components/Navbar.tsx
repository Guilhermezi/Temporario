import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, User, LogOut, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import LanguageSelector from "./LanguageSelector";

const DESKTOP_QUERY = "(min-width: 768px)";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/verificar", label: t("nav.verifier") },
    { to: "/aprender", label: t("nav.learning") },
    { to: "/feed", label: t("nav.blog") },
    { to: "/cartilhas", label: t("nav.guides") },
    { to: "/contato", label: t("nav.contact") },
  ];

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = () => {
      if (media.matches) setIsOpen(false);
    };

    closeOnDesktop();
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const goTo = (path: string) => {
    closeMenu();
    navigate(path);
  };

  const signOut = () => {
    logout();
    goTo("/");
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-ink-200 bg-cream-100/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 md:h-20">
        <button onClick={() => goTo("/")} className="flex min-h-11 items-center gap-2.5 rounded-full pr-2 text-left" aria-label="byTrust home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900">
            <ShieldCheck size={17} className="text-cream-100" />
          </span>
          <span className="font-serif text-lg font-bold leading-none text-ink-900">
            by<em className="not-italic text-gold-500">Trust</em><span className="text-gold-500">.</span>
          </span>
        </button>

        <div className="hidden justify-center md:flex">
          <div className="flex items-center gap-2 lg:gap-5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors lg:text-sm ${isActive ? "text-gold-500" : "text-ink-700 hover:bg-cream-200 hover:text-ink-900"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <LanguageSelector />
          {user ? (
            <>
              <NavLink to="/perfil" className={({ isActive }) => `flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${isActive ? "bg-ink-900 text-cream-100" : "text-ink-600 hover:bg-cream-200 hover:text-ink-900"}`}>
                <User size={16} /> {user.displayName ?? user.username}
              </NavLink>
              <button onClick={signOut} className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-500 hover:bg-cream-200 hover:text-ink-900" aria-label={t("nav.logout")}>
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => goTo("/login")} className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-700 hover:bg-cream-200 hover:text-ink-900 lg:flex">
                <LogOut size={16} className="rotate-180" /> {t("nav.login")}
              </button>
              <button onClick={() => goTo("/login")} className="hidden min-h-11 items-center rounded-xl border-2 border-ink-900 px-5 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-900 hover:text-cream-100 lg:inline-flex">
                {t("nav.create")}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink-300 bg-cream-50 text-ink-900 transition-colors hover:bg-cream-200 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 top-16 bg-ink-900/25 backdrop-blur-[2px] transition-opacity duration-200 md:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMenu}
        aria-hidden
      />

      <div
        id="mobile-menu"
        className={`fixed inset-x-3 top-[4.5rem] origin-top rounded-3xl border border-ink-200 bg-cream-50 p-4 shadow-xl transition-all duration-200 md:hidden ${isOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-3 scale-95 opacity-0"}`}
      >
        <div className="grid gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold transition-colors ${isActive ? "bg-ink-900 text-cream-100" : "text-ink-700 hover:bg-cream-200 hover:text-ink-900"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="my-4 h-px bg-ink-200" />

        <div className="mb-4">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Language</p>
          <LanguageSelector orientation="vertical" onChange={closeMenu} />
        </div>

        <div className="grid gap-2">
          {user ? (
            <>
              <button onClick={() => goTo("/perfil")} className="flex min-h-11 items-center gap-2 rounded-2xl border border-ink-200 px-4 text-sm font-semibold text-ink-700 hover:bg-cream-200">
                <User size={16} /> {user.displayName ?? user.username}
              </button>
              <button onClick={signOut} className="flex min-h-11 items-center gap-2 rounded-2xl border border-ink-200 px-4 text-sm font-semibold text-ink-700 hover:bg-cream-200">
                <LogOut size={16} /> {t("nav.logout")}
              </button>
            </>
          ) : (
            <button onClick={() => goTo("/login")} className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-ink-900 px-4 text-sm font-semibold text-cream-100 hover:bg-ink-800">
              <LogOut size={16} className="rotate-180" /> {t("nav.login")}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
