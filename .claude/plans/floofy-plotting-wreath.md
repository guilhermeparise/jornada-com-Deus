# Plano de Execução: Melhorias no App Jornada com Deus

## Contexto
O usuário solicitou a implementação de várias melhorias identificadas na exploração:
1. Refatoração do gerenciamento de progresso (Custom Hooks).
2. Melhoria em UX (carregamento amigável, feedback visual).
3. Salvamento automático na reflexão (debouncing).
4. Melhoria na resiliência (ErrorBoundary).

## Abordagem Recomendada
Executarei estas tarefas de forma incremental:
1. **Passo 1: Refatoração do gerenciamento de estado**. Criar um hook `useDevotionalProgress` para centralizar a lógica de busca e atualização de progresso, removendo a complexidade de `page.tsx` e `jornada/[dia]/page.tsx`.
2. **Passo 2: Salvamento Automático**. No componente de reflexão, implementar uma função de salvamento com debounce (usando `use-debounce` ou similar nativo) para persistir o texto automaticamente.
3. **Passo 3: UX/UI**. Implementar componentes de loading (Skeletons) e feedback visual (ex: animação simples de sucesso).
4. **Passo 4: Resiliência**. Adicionar `ErrorBoundary` nas rotas críticas.

## Arquivos Críticos
- `src/app/page.tsx` (Dashboard)
- `src/app/jornada/[dia]/page.tsx` (Leitura/Escrita)
- Novos: `src/hooks/useDevotionalProgress.ts`

## Verificação
- Validar cada etapa testando no navegador (via `preview_start` e `preview_snapshot`).
- Garantir que o salvamento automático persista os dados no Supabase.
- Confirmar que erros de rede não exibem mais mensagens técnicas brutas.

---
Este é o plano para implementar as melhorias solicitadas. Vou começar pelo Passo 1.
