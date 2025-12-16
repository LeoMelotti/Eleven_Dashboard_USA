# Eleven Fragrances Dashboard

Dashboard de operações para Eleven Fragrances.

## 🚀 Deploy no Vercel (Grátis)

### Opção 1: Deploy Direto (Mais Fácil)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New Project"
3. Arraste esta pasta ou faça upload do zip
4. Clique em "Deploy"
5. Pronto! Sua dashboard estará online em ~2 minutos

### Opção 2: Via GitHub

1. Crie um repositório no GitHub
2. Faça push deste projeto
3. Conecte o repo ao Vercel
4. Deploy automático!

## ⚙️ Configuração

### Ativar API no N8N

Antes de usar a dashboard, ative o workflow da API no n8n:

1. Acesse https://n8n.srv1199443.hstgr.cloud
2. Vá no workflow "EF - 06 - API Dashboard"
3. Clique em "Activate" (toggle no topo)

### URL da API

A dashboard já está configurada para usar:
```
https://n8n.srv1199443.hstgr.cloud/webhook/eleven-dashboard
```

## 📊 Funcionalidades

- ✅ Contratos ativos e pendentes
- ✅ Equipamentos em operação
- ✅ Receita mensal recorrente
- ✅ Manutenções próximas (7 dias)
- ✅ Instalações pendentes
- ✅ Comissões a pagar
- ✅ Alertas automáticos
- ✅ Atualização automática a cada 1 minuto

## 🛠️ Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## 📁 Estrutura

```
├── pages/
│   ├── _app.js          # App wrapper
│   └── index.js         # Dashboard principal
├── styles/
│   └── globals.css      # Estilos Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🔗 Links Úteis

- N8N: https://n8n.srv1199443.hstgr.cloud
- Planilha: https://docs.google.com/spreadsheets/d/1I1uwAtAjLt-XIfpMkO8NIAeK90q5nqyQBRBNgzF6fPQ

---

© 2025 Eleven Fragrances LLC
