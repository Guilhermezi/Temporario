import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BarChart3,
  Box,
  Braces,
  Check,
  CheckCircle2,
  Clipboard,
  Factory,
  Fingerprint,
  Globe2,
  MapPin,
  PackageCheck,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Reduza fraudes na origem",
    description:
      "Detecte codigos duplicados, consultas suspeitas e desvios antes que eles se transformem em prejuizo ou crise de reputacao.",
  },
  {
    icon: TrendingUp,
    number: "02",
    title: "Transforme protecao em reputacao",
    description:
      "Ofereca ao consumidor uma confirmacao clara de procedencia e mostre que sua marca investe ativamente em transparencia.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Enxergue o pos-venda",
    description:
      "Entenda onde, quando e como os produtos sao verificados para revelar mercados ativos, riscos de canal e oportunidades.",
  },
];

const steps = [
  {
    icon: Factory,
    title: "Cadastre a identidade",
    description: "Envie SKU, lote, serie e outros dados pelo painel ou diretamente pela API.",
  },
  {
    icon: Fingerprint,
    title: "Associe um identificador",
    description: "Vincule QR Code, numero de serie ou etiqueta segura ao registro original.",
  },
  {
    icon: ScanLine,
    title: "Valide em tempo real",
    description: "Cada consulta recebe uma resposta rapida e personalizada com a identidade da marca.",
  },
  {
    icon: BarChart3,
    title: "Acompanhe os sinais",
    description: "Monitore recorrencias, regioes e alertas para agir rapidamente sobre possiveis fraudes.",
  },
];

const testimonials = [
  {
    initials: "CM",
    quote:
      "A verificacao deixou de ser apenas uma barreira contra copias e passou a fazer parte da experiencia premium da nossa marca.",
    name: "Carolina Mendes",
    role: "Diretora de Marca · Empresa de cosmeticos",
  },
  {
    initials: "RA",
    quote:
      "Os sinais de consulta nos deram uma nova visao sobre distribuicao e ajudaram a priorizar regioes que exigiam atencao.",
    name: "Rafael Alves",
    role: "Gerente de Operacoes · Fabricante nacional",
  },
  {
    initials: "LN",
    quote:
      "A integracao foi objetiva e adicionou uma camada de confianca sem exigir o redesenho de toda a infraestrutura.",
    name: "Lucas Nogueira",
    role: "Head de Tecnologia · Marca de acessorios",
  },
];

const codeExample = `const response = await fetch(
  "https://api.bytrust.com/v1/products/verify",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer SUA_CHAVE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product_id: "BT-2026-A8F4-91C2"
    })
  }
);`;

function VerifiedProduct() {
  const { t } = useTranslation();
  return (
    <div className="relative max-w-md mx-auto lg:mr-0">
      <div className="landing-product-card bg-cream-50 border border-ink-200 rounded-[2rem] p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-ink-200">
          <div className="flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((dot) => <span key={dot} className="w-2 h-2 rounded-full bg-ink-200" />)}
          </div>
          <span className="tag-green"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t("learning.product.online")}</span>
        </div>

        <div className="flex items-center gap-4 py-6">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
            <Box className="text-gold-600" size={25} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg">{t("learning.product.name")}</h3>
            <p className="text-xs text-ink-400 font-mono mt-1">ID: BT-2026-A8F4-91C2</p>
          </div>
        </div>

        <div className="landing-scan relative h-48 overflow-hidden rounded-2xl border border-dashed border-ink-300 flex items-center justify-center">
          <div className="w-24 h-24 bg-cream-50 rounded-lg shadow-md p-2 grid grid-cols-5 gap-1" aria-hidden>
            {Array.from({ length: 25 }).map((_, index) => (
              <span key={index} className={`${[1, 3, 5, 7, 9, 11, 15, 17, 21, 23].includes(index) ? "opacity-0" : ""} bg-ink-900 rounded-[2px]`} />
            ))}
          </div>
          <span className="landing-scan-line absolute left-[12%] right-[12%] h-0.5 bg-gold-500 shadow-[0_0_14px_rgba(181,131,42,0.7)]" />
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <span className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0"><Check size={18} /></span>
          <div>
            <strong className="block text-sm">{t("learning.product.verified")}</strong>
            <span className="text-xs text-ink-500">{t("learning.product.validated")}</span>
          </div>
        </div>
      </div>

      <div className="landing-seal absolute -right-2 sm:-right-10 -bottom-12 w-28 h-28 rounded-full bg-ink-900 text-cream-100 border-2 border-ink-900 flex items-center justify-center text-center rotate-[-8deg] shadow-xl">
        <div className="relative z-10">
          <ShieldCheck size={24} className="text-gold-400 mx-auto mb-1" />
          <span className="font-serif font-bold text-xs leading-tight block whitespace-pre-line">{t("learning.product.seal")}</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingAntifalsificacao() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = t("learning.pageTitle");
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const duration = 1600;
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        setCount(Math.floor(500000 * (1 - Math.pow(1 - progress, 4))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.5 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [t, i18n.language]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeExample);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const submitPartner = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen fade-up overflow-hidden">
      <section className="relative px-6 pt-36 lg:pt-32 pb-24 lg:pb-28">
        <div className="absolute w-[520px] h-[520px] bg-gold-500/10 rounded-full blur-3xl left-1/2 top-20 -translate-x-1/2 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.12fr_.88fr] items-center gap-16 lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-3 section-label mb-6">
              <span className="w-2 h-2 bg-emerald-600 rounded-full shadow-[0_0_0_5px_rgba(5,150,105,0.1)]" />
              {t("learning.eyebrow")}
            </div>
            <h1 className="display-title text-5xl sm:text-6xl lg:text-[5.5rem] tracking-[-0.045em] leading-[.98]">
              {t("learning.heroStart")} <span className="relative inline-block z-0"><span className="absolute inset-x-[-4px] bottom-1 h-[32%] bg-gold-500/20 -rotate-1 rounded -z-10" />{t("learning.heroHighlight")}</span>
            </h1>
            <p className="mt-7 text-ink-500 text-base sm:text-lg leading-relaxed max-w-2xl">
              {t("learning.heroText")} <strong className="text-ink-800">{t("learning.heroStrong")}</strong>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#parceria" className="btn-primary text-base px-8 py-3.5 justify-center">{t("learning.protect")} <ArrowRight size={17} /></a>
              <a href="#integracao" className="btn-outline text-base px-8 py-3.5 justify-center">{t("learning.integrationCta")}</a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-ink-500"><ShieldCheck size={16} className="text-gold-600" /> {t("learning.secure")}</p>
          </div>
          <VerifiedProduct />
        </div>
      </section>

      <div className="overflow-hidden border-y border-ink-200 py-3 bg-ink-900 text-cream-100">
        <div className="ticker-track">
          {[...Array(2)].flatMap(() => t("learning.ticker", { returnObjects: true }) as string[]).map((item, index) => (
            <span key={index} className="flex items-center gap-5 text-xs font-semibold tracking-widest uppercase whitespace-nowrap px-6">{item}<span className="text-gold-400">✦</span></span>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="card grid md:grid-cols-[1fr_auto_auto] items-center gap-9 md:gap-14 p-8 md:p-12 rounded-3xl">
          <div>
            <p className="section-label mb-3">{t("learning.scale")}</p>
            <h2 className="font-serif font-black text-3xl md:text-4xl leading-tight">{t("learning.promise")}</h2>
          </div>
          <div className="landing-trust-seal relative w-32 h-32 rounded-full border-2 border-ink-900 flex items-center justify-center text-center">
            <div><ShieldCheck className="text-gold-600 mx-auto mb-1" /><strong className="font-serif text-sm leading-tight block whitespace-pre-line">{t("learning.trustSeal")}</strong></div>
          </div>
          <div>
            <span ref={counterRef} className="font-serif font-black text-5xl lg:text-7xl tracking-tight">+{count.toLocaleString(i18n.language)}</span>
            <span className="block mt-2 text-xs text-ink-500 uppercase tracking-[.16em] font-semibold">{t("learning.verifiedProducts")}</span>
          </div>
        </div>
      </section>

      <section id="beneficios" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="section-label mb-4">{t("learning.value")}</p>
          <h2 className="display-title text-4xl md:text-6xl">{t("learning.competitiveStart")} <em className="text-gold-500">{t("learning.competitiveHighlight")}</em></h2>
          <p className="text-ink-500 mt-5 leading-relaxed">{t("learning.competitiveText")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {benefits.map(({ icon: Icon, number }, index) => (
            <article key={number} className="card-hover group relative overflow-hidden">
              <span className="absolute right-5 top-3 font-serif font-black text-5xl text-ink-200 group-hover:text-ink-300 transition-colors">{number}</span>
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6"><Icon className="text-gold-600" size={24} /></div>
              <h3 className="font-serif font-bold text-xl mb-3">{t(`learning.benefits.${index}.title`)}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{t(`learning.benefits.${index}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="integracao" className="bg-ink-900 text-cream-100 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-cream-300 mb-4">{t("learning.integration")}</p>
          <h2 className="font-serif font-black text-4xl md:text-6xl max-w-4xl leading-tight">{t("learning.productionStart")} <em className="text-gold-400">{t("learning.productionHighlight")}</em></h2>
          <p className="mt-5 text-ink-300 max-w-2xl leading-relaxed">{t("learning.productionText")}</p>

          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-12 lg:gap-16 mt-14">
            <div className="space-y-4">
              {steps.map(({ icon: Icon }, index) => (
                <article key={index} className="group grid grid-cols-[auto_1fr] gap-4 p-5 border border-cream-100/15 rounded-2xl bg-cream-50/[.035] hover:border-gold-400/60 hover:bg-gold-500/10 hover:translate-x-1 transition-all">
                  <span className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center text-gold-400"><Icon size={19} /></span>
                  <div><span className="text-[10px] tracking-widest text-gold-400">{t("learning.step")} 0{index + 1}</span><h3 className="font-serif font-bold text-lg mt-1">{t(`learning.steps.${index}.title`)}</h3><p className="text-sm text-ink-300 leading-relaxed mt-1">{t(`learning.steps.${index}.description`)}</p></div>
                </article>
              ))}
            </div>

            <div className="self-start rounded-2xl overflow-hidden border border-cream-100/15 bg-[#110c07] shadow-2xl">
              <div className="px-5 py-4 border-b border-cream-100/10 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-ink-300">POST /v1/products/verify</span>
                <button onClick={copyCode} className="inline-flex items-center gap-2 border border-cream-100/15 rounded-full px-3 py-1.5 text-xs hover:border-gold-400 transition-colors"><Clipboard size={14} /> {copied ? t("learning.copied") : t("learning.copy")}</button>
              </div>
              <pre className="p-5 sm:p-7 overflow-x-auto text-xs sm:text-sm leading-7 text-[#e9dfcc]"><code>{codeExample}</code></pre>
              <div className="m-5 mt-0 p-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 text-xs"><CheckCircle2 size={18} /> 200 OK · authenticity: verified</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="section-label mb-4">{t("learning.traceability")}</p>
          <h2 className="display-title text-4xl md:text-6xl">{t("learning.saleStart")} <em className="text-gold-500">{t("learning.saleHighlight")}</em></h2>
          <p className="mt-5 text-ink-500 leading-relaxed">{t("learning.saleText")}</p>
          <div className="mt-8 space-y-5">
            {[
              [PackageCheck, "Origem registrada", "Produto, lote e canal passam a ter uma identidade vinculada a marca."],
              [Globe2, "Movimentacoes acompanhadas", "Consultas revelam regioes, datas e recorrencias ao longo da distribuicao."],
              [MapPin, "Sinais de risco identificados", "Repeticoes e desvios inesperados geram informacao para investigacao."],
            ].map(([Icon], index) => {
              const ItemIcon = Icon as typeof PackageCheck;
              return <div key={index} className="flex gap-4 group"><span className="w-12 h-12 rounded-full border border-ink-200 bg-cream-50 flex items-center justify-center shrink-0 group-hover:bg-ink-900 group-hover:text-cream-100 transition-colors"><ItemIcon size={21} /></span><div><h3 className="font-serif font-bold text-lg">{t(`learning.journey.${index}.title`)}</h3><p className="text-sm text-ink-500 leading-relaxed mt-1">{t(`learning.journey.${index}.description`)}</p></div></div>;
            })}
          </div>
        </div>

        <div className="relative bg-ink-900 text-cream-100 rounded-3xl p-8 sm:p-11 overflow-hidden shadow-xl">
          <span className="tag-gold"><Sparkles size={13} /> {t("learning.dashboard")}</span>
          <h3 className="font-serif font-black text-3xl sm:text-4xl leading-tight mt-7">{t("learning.market")}</h3>
          <p className="text-ink-300 mt-4 leading-relaxed">{t("learning.marketText")}</p>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[[Zap, "24/7"], [Fingerprint, "1 ID"], [Braces, "API"], [ShieldCheck, "Alerts"]].map(([Icon, value], index) => {
              const StatIcon = Icon as typeof Zap;
              return <div key={String(value)} className="border border-cream-100/15 rounded-xl p-4 bg-cream-50/[.04]"><StatIcon size={18} className="text-gold-400 mb-3" /><strong className="font-serif text-xl text-gold-400 block">{String(value)}</strong><span className="text-xs text-ink-300">{t(`learning.stats.${index}`)}</span></div>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream-50/60 border-y border-ink-200 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <p className="section-label mb-4">{t("learning.partnersView")}</p>
            <h2 className="display-title text-4xl md:text-6xl">{t("learning.visibleStart")} <em className="text-gold-500">{t("learning.visibleHighlight")}</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((testimonial, index) => (
              <article key={testimonial.name} className="card-hover flex flex-col min-h-[320px]">
                <span className="font-serif text-6xl text-gold-500 leading-none">“</span>
                <blockquote className="font-serif font-bold text-lg leading-relaxed mt-3 mb-7">{t(`learning.testimonials.${index}.quote`)}</blockquote>
                <div className="mt-auto pt-5 border-t border-ink-200 flex gap-3 items-center"><span className="w-11 h-11 rounded-full bg-cream-200 flex items-center justify-center font-bold text-xs">{testimonial.initials}</span><div><strong className="block text-sm">{testimonial.name}</strong><span className="text-xs text-ink-500">{t(`learning.testimonials.${index}.role`)}</span></div></div>
                <small className="mt-3 uppercase tracking-widest text-[9px] text-ink-400">{t("learning.illustrative")}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="parceria" className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-ink-900 text-cream-100 rounded-[2rem] p-7 sm:p-12 lg:p-16 grid lg:grid-cols-[.9fr_1.1fr] gap-12 lg:gap-16 items-center overflow-hidden relative">
          <div className="relative z-10">
            <p className="section-label text-cream-300 mb-4">{t("learning.partnership")}</p>
            <h2 className="font-serif font-black text-4xl md:text-5xl leading-tight">{t("learning.brandStart")} <em className="text-gold-400">{t("learning.brandHighlight")}</em></h2>
            <p className="text-ink-300 mt-5 leading-relaxed">{t("learning.brandText")}</p>
            <div className="flex items-center gap-5 mt-8 text-sm text-ink-300"><Users className="text-gold-400" /><span>{t("learning.consulting")}</span></div>
          </div>

          {sent ? (
            <div className="relative z-10 border border-emerald-500/25 rounded-2xl bg-emerald-500/10 p-9 text-center"><CheckCircle2 size={46} className="text-emerald-400 mx-auto mb-4" /><h3 className="font-serif font-bold text-2xl">{t("learning.received")}</h3><p className="text-ink-300 mt-2">{t("learning.receivedText")}</p><button onClick={() => navigate("/contato")} className="btn-gold mt-6 mx-auto">{t("learning.goContact")} <ArrowRight size={16} /></button></div>
          ) : (
            <form onSubmit={submitPartner} className="relative z-10 grid sm:grid-cols-2 gap-4 border border-cream-100/15 rounded-2xl bg-cream-50/[.05] p-5 sm:p-6">
              <div><label className="label text-cream-200">{t("learning.name")}</label><input required className="input bg-cream-50/5 border-cream-100/20 text-cream-100 placeholder:text-ink-400" placeholder={t("learning.fullName")} /></div>
              <div><label className="label text-cream-200">{t("learning.company")}</label><input required className="input bg-cream-50/5 border-cream-100/20 text-cream-100 placeholder:text-ink-400" placeholder={t("learning.brandName")} /></div>
              <div className="sm:col-span-2"><label className="label text-cream-200">{t("learning.corporateEmail")}</label><input type="email" required className="input bg-cream-50/5 border-cream-100/20 text-cream-100 placeholder:text-ink-400" placeholder="you@company.com" /></div>
              <div className="sm:col-span-2"><label className="label text-cream-200">{t("learning.volume")}</label><select required defaultValue="" className="input bg-[#21170c] border-cream-100/20 text-cream-100"><option value="" disabled>{t("learning.choose")}</option>{(t("learning.ranges", { returnObjects: true }) as string[]).map((range) => <option key={range}>{range}</option>)}</select></div>
              <button type="submit" className="sm:col-span-2 btn bg-cream-100 text-ink-900 hover:bg-cream-200 justify-center py-3.5">{t("learning.request")} <ArrowRight size={17} /></button>
              <p className="sm:col-span-2 text-[10px] text-ink-300 leading-relaxed">{t("learning.consent")}</p>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-cream-50 border-t border-ink-200 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5"><span className="w-8 h-8 rounded-full bg-ink-900 flex items-center justify-center"><ShieldCheck size={16} className="text-cream-100" /></span><span className="font-serif font-bold text-lg">by<em className="not-italic text-gold-500">Trust</em><span className="text-gold-500">.</span></span></div>
          <p className="text-xs text-ink-500">{t("learning.footer")}</p>
          <div className="flex gap-5 text-xs text-ink-600"><button onClick={() => navigate("/privacidade")} className="hover:text-gold-600">{t("learning.privacy")}</button><button onClick={() => navigate("/termos")} className="hover:text-gold-600">{t("learning.terms")}</button><button onClick={() => navigate("/contato")} className="hover:text-gold-600">{t("learning.contact")}</button></div>
        </div>
      </footer>
    </div>
  );
}
