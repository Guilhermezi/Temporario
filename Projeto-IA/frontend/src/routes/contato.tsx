import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — byTrust" },
      { name: "description", content: "Fale com a byTrust. Atendimento para consumidores, varejistas e marcas." },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="sticker mb-6">Fale com a gente</div>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">
          Vamos <span className="tape">conversar</span>?
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Quer integrar a API, virar parceiro ou só tirar uma dúvida? A gente responde rápido.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[
            { icon: Mail, t: "E-mail", d: "contato@bytrust.com", bg: "bg-blue/50" },
            { icon: Phone, t: "Telefone", d: "+55 (11) 4002-8922", bg: "bg-tan/50" },
            { icon: MapPin, t: "Sede", d: "São Paulo · SP · Brasil", bg: "bg-green/50" },
          ].map((c) => (
            <div key={c.t} className={`card-soft ${c.bg}`}>
              <c.icon className="w-6 h-6 mb-2" />
              <div className="font-display text-xl">{c.t}</div>
              <div className="text-sm text-foreground/80">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 card-soft bg-card">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-14 h-14 text-success mx-auto mb-4" />
              <h2 className="font-display text-3xl mb-2">Mensagem enviada!</h2>
              <p className="text-muted-foreground">Nosso time entra em contato em até 1 dia útil.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome"><input required className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background"/></Field>
                <Field label="E-mail"><input type="email" required className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background"/></Field>
              </div>
              <Field label="Empresa (opcional)"><input className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background"/></Field>
              <Field label="Assunto">
                <select className="w-full px-4 py-3 rounded-full border-2 border-foreground bg-background">
                  <option>Integração da API</option>
                  <option>Parceria de marca</option>
                  <option>Suporte ao consumidor</option>
                  <option>Imprensa</option>
                </select>
              </Field>
              <Field label="Mensagem">
                <textarea required rows={5} className="w-full px-4 py-3 rounded-2xl border-2 border-foreground bg-background"/>
              </Field>
              <button className="btn-pill-primary"><Send className="w-4 h-4"/> Enviar mensagem</button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider mb-1">{label}</span>
      {children}
    </label>
  );
}
