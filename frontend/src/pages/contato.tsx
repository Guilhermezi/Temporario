import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function Contato() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-label mb-3">Fale com a gente</p>
        <h1 className="display-title text-4xl md:text-6xl mb-4">
          Vamos conversar?
        </h1>
        <p className="text-ink-600 max-w-2xl mx-auto">
          Quer integrar a API, virar parceiro ou só tirar uma dúvida? A gente responde rápido.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="space-y-4">
          {[
            { icon: Mail, t: "E-mail", d: "contato@bytrust.com" },
            { icon: Phone, t: "Telefone", d: "+55 (11) 4002-8922" },
            { icon: MapPin, t: "Sede", d: "São Paulo · SP · Brasil" },
          ].map((c) => (
            <div key={c.t} className="card">
              <c.icon className="w-5 h-5 mb-2 text-gold-500" />
              <div className="font-serif font-bold text-lg text-ink-900">{c.t}</div>
              <div className="text-sm text-ink-600">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 card">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="font-serif font-bold text-2xl mb-2 text-ink-900">Mensagem enviada!</h2>
              <p className="text-ink-600">Nosso time entra em contato em até 1 dia útil.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nome</label>
                  <input required className="input" />
                </div>
                <div>
                  <label className="label">E-mail</label>
                  <input type="email" required className="input" />
                </div>
              </div>
              <div>
                <label className="label">Empresa (opcional)</label>
                <input className="input" />
              </div>
              <div>
                <label className="label">Assunto</label>
                <select className="input">
                  <option>Integração da API</option>
                  <option>Parceria de marca</option>
                  <option>Suporte ao consumidor</option>
                  <option>Imprensa</option>
                </select>
              </div>
              <div>
                <label className="label">Mensagem</label>
                <textarea required rows={5} className="input" />
              </div>
              <button type="submit" className="btn-primary">
                <Send className="w-4 h-4" /> Enviar mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
