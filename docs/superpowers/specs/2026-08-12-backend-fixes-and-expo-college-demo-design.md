# Design: Correções de qualidade no backend + demo mobile via Expo em rede restrita

Data: 2026-08-12

## Contexto

O projeto Gamestar (`PythonOpet`) é um backend FastAPI (Clean Architecture) + app mobile
Expo/React Native com dados mockados. Uma análise prévia identificou vários problemas de
qualidade no backend. Separadamente, o usuário precisa demonstrar o app mobile num
computador de faculdade com restrições fortes: sem permissão de admin (não pode instalar
Node/Git), política de PowerShell bloqueando scripts `.ps1`, e firewall bloqueando conexões
de entrada (inbound).

**Estado inicial encontrado:** o working tree de `PythonOpet` já tinha mudanças não
commitadas de uma sessão anterior (migração parcial de `passlib` para `bcrypt` puro em
`security.py`, ajustes em reviews, e arquivos novos como `GamesContext.tsx`,
`mobile/src/services/`, scripts de seed). Este design constrói sobre esse estado, sem
descartá-lo.

## Escopo

Dois workstreams independentes:

1. **Fixes de qualidade no backend** (`backend/`) — não têm relação com a demo na
   faculdade (o backend não vai rodar lá), mas corrigem riscos reais no código atual.
2. **Estratégia de conectividade Expo para a demo na faculdade** — usando
   `mobile/` (dentro de `PythonOpet`, considerada a versão oficial; a cópia duplicada em
   `Crud-python/mobile` na raiz do monorepo será marcada como obsoleta).

## Decisão-chave sobre a demo na faculdade

Esclarecido com o usuário: a demo é **apenas no celular do próprio usuário, via Expo Go**
(app já mockado, sem precisar do backend real). O computador da faculdade **não precisa
executar nada** — ele nem participa do fluxo. Isso elimina o impasse original: as
restrições de admin/PowerShell/firewall do PC da faculdade deixam de ser relevantes,
porque nenhum código roda lá.

Fluxo escolhido (opções A + C, combinadas para redundância):

- **A — EAS Update**: publicar o bundle JS numa branch/canal do EAS Update a partir do
  notebook do usuário (ambiente sem restrições). Gera um link/QR permanente, aberto no
  Expo Go do celular. Depende de internet no celular durante a demo (tráfego apenas de
  saída, que redes restritas normalmente não bloqueiam).
- **C — Build standalone Android (EAS Build, profile preview)**: gera um `.apk`
  instalável no celular, plano B 100% offline caso a wifi da faculdade falhe na hora.

Ambos os passos de autenticação (`eas login`) e build/update são executados
manualmente pelo usuário (exigem navegador/credenciais interativas) — o assistente prepara
a configuração e fornece os comandos exatos.

## Fixes de qualidade no backend

| Item | Ação |
|---|---|
| `requirements.txt` / `pyproject.toml` dessincronizados | Alinhar as duas listas de dependências; refletir que `security.py` já usa `bcrypt` puro (remover `passlib` se não usado em outro lugar); adicionar lockfile via `pip freeze > requirements.lock.txt` |
| CORS aberto (`allow_origins=["*"]` + `allow_credentials=True`) | Trocar por lista explícita de origens vinda de `settings` (env var), com fallback de dev local |
| Quebra de encapsulamento (`user_service._repo` em `get_current_user`) | Adicionar método público `get_by_id` em `UserService` e usar em vez do atributo privado |
| `banco.txt` com nome do servidor Azure em texto puro | Mover para variável em `.env.example`; remover `banco.txt` do repositório e garantir `.gitignore` |
| `SECRET_KEY` de demo sem validação | Em `config.py`, falhar alto (erro claro no startup) se `ENV=production` e `SECRET_KEY` ainda for o valor demo |
| Testes de integração vazios / Postgres hardcoded em `conftest.py` | Tornar a URL de teste configurável via env var com fallback (não implementar novos testes — fora de escopo) |

Fora de escopo: estrutura de camadas, testes unitários existentes, Dockerfile/CI.

## Estratégia Expo — passos técnicos

1. Confirmar que `PythonOpet/mobile` roda 100% com mock data (sem chamada de rede real
   ao backend) — já é o caso hoje.
2. Adicionar/validar `eas-cli` como devDependency e configurar `app.json`/`app.config`
   com `projectId` do Expo.
3. Documentar (não executar por serem interativos):
   - `eas login`
   - `eas update --branch presentation --message "..."` → gera link/QR permanente
   - `eas build --platform android --profile preview` → gera `.apk`
4. Checklist do dia da apresentação: abrir o link no Expo Go (plano A) ou abrir o app
   já instalado via APK (plano C).
5. Marcar `Crud-python/mobile` (raiz, duplicada) como obsoleta — documentar em um
   README/nota que a versão oficial é `PythonOpet/mobile`. Não apagar sem confirmação
   adicional do usuário.

## Fora de escopo

- Conectar o app mobile ao backend real durante a demo.
- Rodar qualquer processo no computador da faculdade.
- Implementar testes de integração novos.
- Build iOS (exigiria conta paga/TestFlight) — apenas Android via APK.
