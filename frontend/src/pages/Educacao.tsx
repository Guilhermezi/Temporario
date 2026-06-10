import { useState, useEffect } from 'react'
import { Loader2, BookOpen, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
import { api, type EducationItem } from '../lib/api'

export default function Educacao() {
  const [items, setItems] = useState<EducationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<(EducationItem & { body: string }) | null>(null)
  const [loadingArticle, setLoadingArticle] = useState(false)

  useEffect(() => { api.education.list().then(setItems).finally(() => setLoading(false)) }, [])

  const open = async (slug: string) => {
    setLoadingArticle(true)
    try { setSelected(await api.education.get(slug)) }
    catch (e: any) { alert(e.message) }
    finally { setLoadingArticle(false) }
  }

  const typeLabel: Record<string, string> = {
    ARTICLE: 'Artigo', VIDEO: 'Vídeo', QUIZ: 'Quiz', INFOGRAPHIC: 'Infográfico'
  }
  const typeColor: Record<string, string> = {
    ARTICLE: 'text-blue-700 bg-blue-50 border border-blue-200',
    VIDEO: 'text-purple-700 bg-purple-50 border border-purple-200',
    QUIZ: 'text-gold-600 bg-gold-500/10 border border-gold-500/20',
    INFOGRAPHIC: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  }

  if (selected) return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 fade-up">
      <button
        onClick={() => setSelected(null)}
        className="flex items-center gap-2 text-ink-500 hover:text-ink-900 mb-8 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Voltar para Learning
      </button>
      <span className={`tag ${typeColor[selected.contentType] ?? 'text-ink-500 bg-ink-100'}`}>
        {typeLabel[selected.contentType] ?? selected.contentType}
      </span>
      <h1 className="font-serif font-black text-4xl text-ink-900 mt-4 mb-6 leading-tight">
        {selected.title}
      </h1>
      {selected.imageUrl && (
        <img
          src={selected.imageUrl}
          alt={selected.title}
          className="w-full rounded-2xl mb-8 border border-ink-200"
        />
      )}
      <div className="prose max-w-none text-ink-700 leading-relaxed whitespace-pre-wrap text-base">
        {selected.body}
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-20 fade-up">
      {/* Header */}
      <div className="mb-12">
        <p className="section-label mb-3">Conteúdo educativo</p>
        <h1 className="font-serif font-black text-5xl text-ink-900 mb-3">Learning</h1>
        <p className="text-ink-500 text-base max-w-md leading-relaxed">
          Conteúdos para consumir com mais consciência e identificar produtos falsificados.
        </p>
      </div>

      {loading || loadingArticle ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-ink-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto mb-4 text-ink-300" />
          <p className="font-serif text-xl font-bold text-ink-700 mb-1">Em breve</p>
          <p className="text-ink-400 text-sm">Nenhum conteúdo publicado ainda.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => open(item.slug)}
              className="card-hover text-left group flex flex-col"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-44 object-cover rounded-xl mb-4 border border-ink-100"
                />
              )}
              <div className="flex items-center justify-between mb-3">
                <span className={`tag text-xs ${typeColor[item.contentType] ?? 'text-ink-500 bg-ink-100'}`}>
                  {typeLabel[item.contentType] ?? item.contentType}
                </span>
                {item.readTimeMin && (
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Clock size={11} /> {item.readTimeMin} min
                  </span>
                )}
              </div>
              <div className="font-serif font-bold text-lg text-ink-900 group-hover:text-gold-600 transition-colors flex items-start justify-between gap-2 flex-1">
                <span>{item.title}</span>
                <ChevronRight size={16} className="text-ink-300 group-hover:text-gold-500 shrink-0 mt-0.5 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
