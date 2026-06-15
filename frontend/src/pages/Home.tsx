import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Upload, Zap } from "lucide-react";
import { getPageCopy } from "../locales/pageCopy";

const STEP_ICONS = [Upload, ShieldCheck, Zap];

export default function Home() {
  const { i18n } = useTranslation();
  const c = getPageCopy(i18n.language).home;

  return (
    <div className="min-h-screen fade-up">
      {/* Hero */}
      <section className="pt-32 pb-20 px-5 text-center max-w-4xl mx-auto">
        <h1 className="display-title text-5xl md:text-7xl mb-6">{c.hero}</h1>
        <p className="text-ink-600 text-xl max-w-2xl mx-auto mb-10">{c.heroSub}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/verificar" className="btn-primary px-8 py-4 text-base">
            {c.cta}
          </Link>
          <Link to="/educacao" className="btn-secondary px-8 py-4 text-base">
            {c.ctaSecondary}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-5 bg-cream-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif font-black text-3xl md:text-4xl text-ink-900 text-center mb-12">
            {c.howTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-ink-900 flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-cream-100" />
                  </div>
                  <h3 className="font-bold text-ink-900 mb-2">{step.title}</h3>
                  <p className="text-ink-500 text-sm">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why byTrust */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif font-black text-3xl md:text-4xl text-ink-900 text-center mb-12">
            {c.trustTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.trusts.map((item, i) => (
              <div key={i} className="border border-ink-100 rounded-2xl p-6">
                <h3 className="font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-ink-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}