git commit -m "fix: Corrige 3 problemas na Agenda Semanal

1. Inclui instâncias de tarefas recorrentes na agenda semanal
   - Agora carrega tanto tarefas normais quanto instâncias de recorrentes
   - Remove duplicatas usando Map

2. Altera início da semana de segunda para domingo
   - Semana agora vai de Domingo (12/04) a Sábado (18/04)
   - Atualizado selectedDay para usar índice correto (0=Domingo)

3. Filtra apenas metas mensais ao criar tarefa da agenda semanal
   - Adiciona parâmetro 'origem=semana' na URL
   - Quando origem=semana, mostra apenas metas mensais no select
   - Caso contrário, mantém comportamento padrão (Grandes + Anuais)

Arquivos modificados:
- src/app/pages/agenda/AgendaSemanaPage.tsx
- src/app/pages/agenda/TarefaCreatePage.tsx"