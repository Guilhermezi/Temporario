import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { getPageCopy } from "../locales/pageCopy";

export default function Contato() {
  const [sent, setSent] = useState(false);
  const { i18n } = useTranslation();
  const c = getPageCopy(i18n.language).contact;
  const contacts = [{ icon: Mail, title: c.email, detail: "contato@bytrust.com" }, { icon: Phone, title: c.phone, detail: "+55 (11) 4002-8922" }, { icon: MapPin, title: c.office, detail: c.location }];
  return <div className="min-h-screen fade-up pt-28 pb-16 px-5 max-w-6xl mx-auto">
    <div className="text-center mb-10"><p className="section-label mb-3">{c.eyebrow}</p><h1 className="display-title text-4xl md:text-6xl mb-4">{c.title}</h1><p className="text-ink-600 max-w-2xl mx-auto">{c.text}</p></div>
    <div className="grid md:grid-cols-3 gap-5"><div className="space-y-4">{contacts.map(({ icon: Icon, title, detail }) => <div key={title} className="card"><Icon className="w-5 h-5 mb-2 text-gold-500"/><div className="font-serif font-bold text-lg">{title}</div><div className="text-sm text-ink-600">{detail}</div></div>)}</div>
      <div className="md:col-span-2 card">{sent ? <div className="text-center py-12"><CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4"/><h2 className="font-serif font-bold text-2xl mb-2">{c.sent}</h2><p className="text-ink-600">{c.sentText}</p></div> : <form onSubmit={e=>{e.preventDefault();setSent(true)}} className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><div><label className="label">{c.name}</label><input required className="input"/></div><div><label className="label">{c.email}</label><input type="email" required className="input"/></div></div><div><label className="label">{c.company}</label><input className="input"/></div><div><label className="label">{c.subject}</label><select className="input">{c.subjects.map(x=><option key={x}>{x}</option>)}</select></div><div><label className="label">{c.message}</label><textarea required rows={5} className="input"/></div><button type="submit" className="btn-primary"><Send className="w-4 h-4"/> {c.send}</button></form>}</div>
    </div>
  </div>;
}
