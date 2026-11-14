
# JORNADA COM DEUS — PROGRESSO

## Objetivo
Construir um micro SaaS cristão com Next.js,
Supabase e PWA, para venda de acesso.

## Ambiente
- Windows + VS Code
- Pasta: C:\Users\guilherme\jornada-com-deus
- Next.js 16 + TypeScript
- Supabase
- Site local: http://localhost:3000
- Futuro domínio: .com.br
- Hospedagem: ainda não definida para uso comercial

## Funcionalidades desenvolvidas
- Login e cadastro
- Jornada de 30 dias
- Leitura bíblica
- Diário de orações
- Perfil do usuário
- Página de notificações
- Service Worker
- Registro de dispositivos no Supabase
- Notificação de teste exibida no Windows

## Banco de dados
- profiles
- journey_progress
- prayer_requests
- prayer_reflections
- notification_preferences
- push_subscriptions
- fixed_messages

## Notificações
- Web Push com VAPID
- Horário personalizado
- Mensagens na tabela fixed_messages
- Rota: src/app/api/notifications/daily/route.ts
- Agendamento em vercel.json
- Envio automático ainda não validado

## Variáveis de ambiente
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- VAPID_SUBJECT
- CRON_SECRET

Nunca copiar valores secretos neste arquivo.

## Problema atual
O comando npm run build apresentou erro porque
cacheComponents é incompatível com a declaração
export const runtime = "nodejs".

Próxima ação:
Remover estas linhas de daily/route.ts:

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

Depois executar:
npm run build

## Pendências
1. Corrigir erros do build.
2. Validar envio diário real.
3. Melhorar prevenção de mensagens duplicadas.
4. Configurar agendamento compatível com hospedagem.
5. Testar PWA e notificações no iPhone.
6. Publicar em HTTPS.
7. Registrar domínio .com.br.
8. Validar vendas com dois clientes.

## Cuidados
- Não apagar arquivos funcionais.
- Não expor chaves privadas.
- Testar cada alteração antes de avançar.
- Não usar Vercel Hobby para operação comercial.
