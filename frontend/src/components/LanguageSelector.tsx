import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "pt", flag: "\uD83C\uDDE7\uD83C\uDDF7", short: "PT", label: "Portugues" },
  { code: "es", flag: "\uD83C\uDDEA\uD83C\uDDF8", short: "ES", label: "Espanol" },
  { code: "en", flag: "\uD83C\uDDFA\uD83C\uDDF8", short: "EN", label: "English" },
] as const;

type LanguageSelectorProps = {
  orientation?: "horizontal" | "vertical";
  onChange?: () => void;
};

export default function LanguageSelector({ orientation = "horizontal", onChange }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentCode = i18n.resolvedLanguage?.split("-")[0] ?? "pt";
  const current = languages.find((language) => language.code === currentCode) ?? languages[0];
  const isMobileMenu = orientation === "vertical";

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    setOpen(false);
    onChange?.();
  };

  return (
    <div ref={rootRef} className={`relative ${isMobileMenu ? "w-full" : "w-auto"}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex min-h-11 items-center gap-2 border border-ink-300 bg-cream-50 text-sm font-bold text-ink-800 shadow-sm transition-all hover:bg-cream-200 ${
          isMobileMenu
            ? "w-full justify-between rounded-2xl px-4 py-3"
            : "rounded-full px-3 py-2"
        }`}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-lg leading-none">
            {current.flag}
          </span>
          <span>{current.short}</span>
        </span>
        <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          ▼
        </span>
      </button>

      <div
        role="listbox"
        className={`absolute z-[70] mt-2 min-w-full overflow-hidden rounded-2xl border border-ink-200 bg-cream-50 p-1 shadow-xl transition-all duration-150 ${
          isMobileMenu ? "left-0 right-0" : "right-0 w-40"
        } ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
      >
        {languages.map((language) => (
          <button
            key={language.code}
            type="button"
            role="option"
            aria-selected={current.code === language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-semibold transition-colors ${
              current.code === language.code
                ? "bg-ink-900 text-cream-100"
                : "text-ink-700 hover:bg-cream-200 hover:text-ink-900"
            }`}
          >
            <span aria-hidden className="text-lg leading-none">
              {language.flag}
            </span>
            <span>{language.short}</span>
            <span className="ml-auto text-xs font-medium opacity-75">{language.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
