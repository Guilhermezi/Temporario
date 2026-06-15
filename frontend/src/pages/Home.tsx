import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, ArrowRight, Zap, Trophy, Users } from "lucide-react";

export default function Home() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const features = [ShieldCheck, Trophy, Users];

  return (
    <div className="min-h-screen flex flex-col fade-up">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 relative">
        <p className="section-label mb-6">{t("home.eyebrow")}</p>
        <div className="relative mb-2"><span className="relative inline-block"><span className="absolute inset-0 bg-gold-500/20 rounded -rotate-1 scale-x-105 scale-y-110" /><h1 className="display-title text-5xl md:text-7xl lg:text-8xl relative z-10 px-4">byTrust</h1></span></div>
        <h2 className="display-title text-4xl md:text-6xl lg:text-7xl mt-2 max-w-3xl">{t("home.title1")}<br />{t("home.title2")}</h2>
        <div className="mt-8 mb-8"><span className="stamp">{t("home.stamp1")}<br />{t("home.stamp2")}</span></div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2"><button onClick={() => nav("/verificar")} className="btn-primary text-base px-8 py-3.5">{t("home.verify")} <ArrowRight size={17} /></button><button onClick={() => nav("/aprender")} className="btn-outline text-base px-8 py-3.5">{t("home.learn")}</button></div>
        <p className="mt-8 text-ink-500 text-sm max-w-lg leading-relaxed">{t("home.description1")} <strong className="text-ink-800">{t("home.original")}</strong> {t("home.or")} <strong className="text-ink-800">{t("home.fake")}</strong>.</p>
      </section>
      <div className="overflow-hidden border-y border-ink-200 py-3 bg-ink-900 text-cream-100"><div className="ticker-track">{[...Array(2)].flatMap(() => t("learning.ticker", { returnObjects: true }) as string[]).map((item, i) => <span key={i} className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase whitespace-nowrap px-6">{item}<span className="text-gold-400">✦</span></span>)}</div></div>
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {features.map((Icon, index) => <div key={index} className="card-hover group"><div className="flex items-start justify-between mb-5"><div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center"><Icon size={26} className="text-gold-500" /></div><span className="font-serif text-4xl font-black text-ink-200">0{index + 1}</span></div><h3 className="font-serif font-bold text-lg mb-2">{t(`home.features.${index}.title`)}</h3><p className="text-ink-500 text-sm leading-relaxed">{t(`home.features.${index}.description`)}</p></div>)}
      </section>
      <section className="bg-ink-900 py-16 px-6"><div className="max-w-3xl mx-auto text-center"><p className="section-label text-cream-300 mb-4">{t("home.ready")}</p><h2 className="font-serif font-black text-4xl md:text-5xl text-cream-100 mb-8">{t("home.bottom")}</h2><button onClick={() => nav("/verificar")} className="inline-flex items-center gap-2 bg-cream-100 text-ink-900 font-semibold px-8 py-3.5 rounded-full hover:bg-cream-200"><Zap size={16} className="text-gold-500" />{t("home.verify")}</button></div></section>
    </div>
  );
}
