# byTrust — Protegendo sua confiança

> Plataforma de verificação de autenticidade de produtos, combate à falsificação e educação do consumidor no Brasil e América Latina.

**Desenvolvido em parceria com [J.A-Brasil (Junior Activist)](https://ja-brasil.org) e [Mercado Livre](https://mercadolivre.com.br).**

---

## Sobre o projeto

O byTrust é uma plataforma que conecta consumidores, marcas e autoridades no combate à falsificação de produtos. Permite verificar a autenticidade de itens, reportar suspeitas, acompanhar alertas do mercado e acessar conteúdo educativo sobre como identificar produtos falsificados.

O projeto nasce da necessidade de proteger consumidores brasileiros e latino-americanos de prejuízos causados por produtos falsos — que vão de roupas e eletrônicos a medicamentos e peças automotivas.

---

## Funcionalidades

- **Verificação de produto** — consulta de autenticidade via código ou QR Code
- **Feed de notícias** — publicação automática de alertas e notícias sobre falsificação no Brasil e América Latina, atualizado a cada 6 horas
- **Denúncias** — canal para reportar produtos suspeitos
- **Conteúdo educativo** — artigos e guias para identificar falsificações
- **Comunidade** — espaço para troca de experiências entre consumidores
- **Autenticação segura** — login com JWT, rotas protegidas

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Banco de dados | PostgreSQL + Prisma ORM |
| Autenticação | JWT |
| Ingestão de notícias | Google News RSS + Node.js |
| Deploy frontend | Vercel |
| Deploy backend | Railway |
| Cron de notícias | Railway Cron Service (Docker/Alpine) |

---

## Estrutura do repositório

```
/
├── frontend/               # Aplicação React
│   └── src/
│       ├── pages/          # Feed, Aprender, Verificar, Denúncias...
│       ├── components/     # Componentes reutilizáveis
│       └── lib/            # Configuração de API
│
├── backend/                # API Express
│   ├── src/
│   │   ├── routes/         # Rotas: auth, community, education, newsIngest
│   │   ├── services/       # newsIngester (ingestão automática de notícias)
│   │   ├── middleware/     # Autenticação JWT
│   │   └── models/         # Prisma client
│   └── prisma/
│       └── schema.prisma   # Schema do banco de dados
│
└── cron-ingest/            # Serviço de cron (Docker Alpine + curl)
    ├── Dockerfile
    └── entrypoint.sh
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com sua DATABASE_URL, JWT_SECRET e ADMIN_SECRET
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edite .env com a URL do backend
npm run dev
```

---

## Variáveis de ambiente

### Backend (`.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bytrust
JWT_SECRET=seu-segredo-jwt
ADMIN_SECRET=seu-segredo-admin
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Ingestão de notícias (opcionais — têm defaults)
NEWS_MAX_POSTS=5
NEWS_DAYS_BACK=2
NEWS_DRY_RUN=false
```

### Cron Service (Railway)

```env
BACKEND_URL=https://seu-backend.up.railway.app
ADMIN_SECRET=mesmo-valor-do-backend
```

---

## Ingestão automática de notícias

O Feed é alimentado automaticamente por um serviço que busca notícias sobre falsificação e contrafação no Brasil e América Latina via Google News RSS.

- **Frequência:** a cada 6 horas
- **Fonte:** Google News RSS (10 queries específicas)
- **Filtros:** palavras-chave positivas, termos bloqueados, fontes confiáveis
- **Deduplicação:** fingerprint SHA-256 por notícia, salvo no banco
- **Publicação:** posts automáticos no Feed como `@byTrust Notícias` com `isAuto: true`

Para disparar manualmente:

```bash
curl -X POST https://seu-backend.up.railway.app/api/admin/news-ingest \
  -H "x-admin-secret: seu-segredo"

# Dry run (não grava nada)
curl -X POST https://seu-backend.up.railway.app/api/admin/news-ingest?dry_run=true \
  -H "x-admin-secret: seu-segredo"
```

---

## Deploy

### Backend → Railway

1. Conecte o repositório no Railway
2. Configure as variáveis de ambiente
3. O Railway detecta o `package.json` e faz o deploy automaticamente

### Frontend → Vercel

1. Conecte o repositório na Vercel
2. Configure `VITE_API_URL` apontando para o backend no Railway
3. Deploy automático a cada push na `main`

### Cron de notícias → Railway Cron Service

1. Crie um novo serviço no Railway com Root Directory `cron-ingest`
2. Configure `BACKEND_URL` e `ADMIN_SECRET`
3. Em Settings → Cron Schedule: `0 */6 * * *`

---

## Parcerias

| Parceiro | Contribuição |
|---|---|
| **J.A-Brasil (Junior Activist)** | Parceria institucional, mobilização e comunicação com consumidores jovens |
| **Mercado Livre** | Parceria tecnológica e de dados para verificação de autenticidade de produtos |

---

## Licença

Todos os direitos reservados © byTrust 2026.
