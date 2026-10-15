# SHUB LIFE — Roadmap

## Em andamento
- [ ] Migração de dados do projeto externo do usuário para o banco do app
  - Bloqueado: aguarda o upload dos arquivos CSV/JSON exportados de lá (não é possível ler esse banco daqui).
  - Ao chegar: sanitizar, importar em ordem de dependência (perfis → papéis → vínculos → treinos → financeiro → social) e conferir contagens.
  - Contas de login precisam ser recriadas (senha antiga não pode ser transferida).

## Concluído
- [x] Backend, schema, RBAC, RLS e Realtime
- [x] Dashboards admin / profissional / aluno / influenciador
- [x] Landing page com planos de aluno e profissional
- [x] Logo, ícone e favicon
- [x] Conta master com o novo e-mail

## Pendente (externo)
- [ ] Pagamentos recorrentes (Asaas) — depende de credenciais do usuário
