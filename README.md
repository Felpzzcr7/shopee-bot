# 🛒 Shopee Affiliate Bot — Telegram

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" />
</p>

> Bot para Telegram desenvolvido em TypeScript e arquitetura Serverless (Vercel Functions) que converte links de produtos da Shopee em links de afiliados rastreáveis de forma 100% automatizada.

---

## 📱 Como Testar / Acessar o Bot

Você pode testar a conversão de links enviando qualquer produto da Shopee diretamente no Telegram:

👉 **[Clique aqui para abrir o Bot no Telegram](https://t.me/Felpzz_shopee_bot)**

* **Formas de envio aceitas:**
  * Cola direta do link completo (`https://shopee.com.br/...`)
  * Links encurtados (`https://shp.ee/...`, `https://s.shopee.com.br/...`)
  * **Compartilhamento direto do app da Shopee** (Foto + Legenda)

---

## 🚀 Funcionalidades

- ⚡ **Serverless & Ultra Rápido:** Hospedado em funções Serverless na Vercel com resposta via Webhook do Telegram.
- 📲 **Suporte a Mídia & Compartilhamento do App:** Trata tanto mensagens de texto quanto envios de imagens com legenda geradas pelo botão "Compartilhar" do aplicativo da Shopee.
- 🔗 **Expansão Automática de URLs (Unshortener):** Identifica links encurtados do aplicativo e os resolve para a URL canônica do produto antes da chamada na API.
- 🔐 **Autenticação Segura SHA256:** Implementa o algoritmo de assinatura criptográfica exigido pela Open API GraphQL da Shopee Afiliados.
- 🤖 **RegEx Inteligente:** Extrai links mesmo que o usuário envie textos ou emojis junto com a mensagem.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework de Bot:** [Telegraf](https://telegraf.js.org/)
- **Hospedagem:** [Vercel Serverless Functions](https://vercel.com/)
- **Integrador de API:** Shopee Open API (GraphQL)
- **Criptografia:** Módulo nativo `crypto` do Node.js (`SHA256`)

---

## ⚙️ Variáveis de Ambiente

Para rodar este projeto, é necessário configurar as seguintes variáveis de ambiente no painel da Vercel:

| Variável | Descrição |
| :--- | :--- |
| `TELEGRAM_TOKEN` | Token de API fornecido pelo `@BotFather` no Telegram. |
| `SHOPEE_APP_ID` | Seus credenciais de App ID obtidas no Console de Afiliados da Shopee. |
| `SHOPEE_APP_SECRET` | Chave secreta de API obtida no Console de Afiliados da Shopee. |
