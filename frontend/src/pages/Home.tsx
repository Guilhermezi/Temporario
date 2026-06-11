import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Zap, Trophy, Users } from 'lucide-react'

const TICKER_ITEMS = [
  'API ANTIPIRATARIA',
  'CONFIANÇA CERTIFICADA',
  'VERIFICAÇÃO EM TEMPO REAL',
  '+500 MIL PRODUTOS VERIFICADOS',
  'CONFIANÇA CERTIFICADA',
  'PRODUTOS VERIFICADOS',
  'API ANTIPIRATARIA',
  'VERIFICAÇÃO EM TEMPO REAL',
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col fade-up">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative">
        <span className="absolute right-[9%] top-36 text-2xl text-ink-400 select-none hidden lg:block" aria-hidden>···</span>

        <p className="section-label mb-6">Junte-se à comunidade antifalsificação</p>

        {/* Hero headline */}
        <div className="relative mb-2">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gold-500/20 rounded -rotate-1 scale-x-105 scale-y-110" aria-hidden />
            <h1 className="display-title text-5xl md:text-7xl lg:text-8xl relative z-10 px-4">
              byTrust
            </h1>
          </span>
        </div>

        <h2 className="display-title text-4xl md:text-6xl lg:text-7xl mt-2 max-w-3xl">
          protegendo sua <em>confiança,</em>
          <br />produto por produto
        </h2>

        {/* Stamp */}
        <div className="mt-8 mb-8">
          <span className="stamp">
            Onde a autenticidade vira certeza,<br />e a falsificação vira história.
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button onClick={() => nav('/verificar')} className="btn-primary text-base px-8 py-3.5">
            Verificar autenticidade agora <ArrowRight size={17} />
          </button>
          <button onClick={() => nav('/aprender')} className="btn-outline text-base px-8 py-3.5">
            Aprender mais
          </button>
        </div>

        <p className="mt-8 text-ink-500 text-sm max-w-md leading-relaxed">
          A API byTrust valida cada item em tempo real — um simples código, QR ou foto basta
          para confirmar se um produto é <strong className="text-ink-800">original</strong> ou <strong className="text-ink-800">falsificado</strong>.
        </p>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-y border-ink-200 py-3 bg-ink-900 text-cream-100">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase whitespace-nowrap px-6">
              {item}
              <span className="text-gold-400" aria-hidden>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <ShieldCheck size={26} className="text-gold-500" />,
            tag: '01',
            title: 'Verificação real',
            desc: 'Conectado ao sistema de autenticação das marcas parceiras em tempo real.',
          },
          {
            icon: <Trophy size={26} className="text-gold-500" />,
            tag: '02',
            title: 'Badges & conquistas',
            desc: '12 badges para colecionar conforme você verifica produtos e constrói confiança.',
          },
          {
            icon: <Users size={26} className="text-gold-500" />,
            tag: '03',
            title: 'Comunidade',
            desc: 'Compartilhe suas verificações, inspire outras pessoas e proteja o mercado.',
          },
        ].map((f) => (
          <div key={f.title} className="card-hover group">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                {f.icon}
              </div>
              <span className="font-serif text-4xl font-black text-ink-200 group-hover:text-ink-300 transition-colors">
                {f.tag}
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-ink-900 mb-2">{f.title}</h3>
            <p className="text-ink-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA band */}
      <section className="bg-ink-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label text-cream-300 mb-4">Pronto para começar?</p>
          <h2 className="font-serif font-black text-4xl md:text-5xl text-cream-100 mb-8 leading-tight">
            Verifique seu próximo produto <em>agora</em>
          </h2>
          <button
            onClick={() => nav('/verificar')}
            className="inline-flex items-center gap-2 bg-cream-100 text-ink-900 font-semibold px-8 py-3.5 rounded-full hover:bg-cream-200 transition-colors"
          >
            <Zap size={16} className="text-gold-500" /> Verificar autenticidade agora
          </button>
        </div>
      </section>
    </div>
  )
}
