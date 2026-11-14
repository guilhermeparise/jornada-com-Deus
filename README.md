This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Notificações push

O fluxo de notificações usa Web Push. Configure no `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=chave-publica
VAPID_PRIVATE_KEY=chave-privada
VAPID_SUBJECT=mailto:seu-email-de-contato
```

As chaves pública e privada precisam pertencer ao mesmo par VAPID. A chave
privada e o contato são usados somente no servidor. A chave pública também
precisa estar disponível no build do Next.js.

A tabela `push_subscriptions` deve ter `user_id`, `endpoint` e `subscription`,
com `endpoint` único. As políticas RLS precisam permitir que o usuário
autenticado registre, consulte e remova apenas as próprias inscrições. A
página `/notifications` registra o dispositivo e oferece o envio de uma
notificação de teste para confirmar a configuração.

## Devocional diário e sequência

O calendário aceita datas de qualquer mês. Os 30 devocionais atuais são
reaproveitados ao longo do ano; o progresso e a sequência ficam salvos por data.
Para ativar esse formato no Supabase, execute uma vez o arquivo
`supabase/migrations/20261112000000_daily_devotional_progress.sql` no SQL Editor.
Ele cria a tabela com RLS e importa as conclusões antigas com data registrada.

O lembrete push diário usa o catálogo de 30 mensagens sem repetir em dias
seguidos. Para agendar em produção, configure também `SUPABASE_SERVICE_ROLE_KEY`
e `CRON_SECRET` como variáveis de servidor no deploy. A rota protegida
`/api/notifications/daily` é chamada de hora em hora pela configuração em
`vercel.json` em produção e envia no horário local escolhido pela pessoa. O service role
key nunca deve usar o prefixo `NEXT_PUBLIC_`.

## Checkout da Cakto

A página de oferta fica em `/venda`. Para ligar o botão ao checkout, configure
`NEXT_PUBLIC_CAKTO_CHECKOUT_URL` com o link de pagamento da Cakto no ambiente de
deploy e gere um novo build. Configure a entrega do produto pela área de membros
da Cakto após a aprovação do pagamento.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
