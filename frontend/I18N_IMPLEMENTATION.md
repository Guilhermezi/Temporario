# Internacionalizacao do frontend

## Opcao 1: react-i18next (implementada)

Arquivos principais:

- `src/i18n.ts`: inicializacao global, fallback e persistencia em `localStorage`.
- `src/locales/pt.json`, `es.json`, `en.json`: dicionarios.
- `src/components/LanguageSelector.tsx`: seletor PT, ES e EN.
- `src/main.tsx`: importa a configuracao antes de renderizar o app.

Uso em qualquer componente:

```tsx
import { useTranslation } from "react-i18next";

export default function Example() {
  const { t } = useTranslation();

  return (
    <section>
      <h1>{t("home.title1")}</h1>
      <p>{t("home.description1")}</p>
      <button>{t("home.verify")}</button>
    </section>
  );
}
```

Para adicionar texto, crie a mesma chave nos tres JSONs e use `t("grupo.chave")`.

## Opcao 2: Context API, sem bibliotecas

Exemplo autocontido:

```tsx
import { createContext, ReactNode, useContext, useState } from "react";

type Language = "pt" | "es" | "en";

const dictionary = {
  pt: { title: "Confiança que acompanha cada produto.", action: "Começar" },
  es: { title: "Confianza que acompaña cada producto.", action: "Comenzar" },
  en: { title: "Trust that follows every product.", action: "Get started" },
} as const;

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof dictionary.pt) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");
  const t = (key: keyof typeof dictionary.pt) => dictionary[language][key];
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage deve ser usado dentro de LanguageProvider");
  return value;
}

export function SimpleSelector() {
  const { language, setLanguage } = useLanguage();
  return <div>{(["pt", "es", "en"] as const).map(code => <button aria-pressed={language === code} onClick={() => setLanguage(code)}>{code.toUpperCase()}</button>)}</div>;
}
```

No app:

```tsx
<LanguageProvider>
  <App />
</LanguageProvider>
```

## Textos dinamicos da API

O formato recomendado e a API devolver campos por idioma:

```json
{
  "title": { "pt": "Autenticidade", "es": "Autenticidad", "en": "Authenticity" }
}
```

No componente:

```tsx
const language = i18n.resolvedLanguage?.split("-")[0] ?? "pt";
const title = item.title[language] ?? item.title.pt;
```

Outra opcao e enviar `Accept-Language: pt`, `es` ou `en` nas requisicoes e deixar o backend retornar o conteudo localizado.
