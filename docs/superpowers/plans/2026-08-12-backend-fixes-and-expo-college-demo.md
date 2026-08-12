# Backend Fixes + Expo College Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the backend quality issues found in the Gamestar codebase, and set up the mobile app (`PythonOpet/mobile`) so it can be demoed on a personal phone via Expo Go / a standalone APK at a network-restricted college computer, without that computer running anything at all.

**Architecture:** Backend fixes are surgical edits to existing FastAPI/SQLAlchemy modules — no new layers. The Expo demo strategy adds `expo-updates` + `eas.json` to the existing Expo project so the JS bundle can be published to EAS Update (cloud-hosted, opened via a permanent link/QR in Expo Go) and built into a standalone Android APK via EAS Build — both executed by the human operator since they require interactive Expo account login.

**Tech Stack:** Python 3.11+, FastAPI, SQLAlchemy 2.x async, Alembic, pytest; React Native + Expo SDK 54, TypeScript, EAS CLI.

## Global Constraints

- Do not touch the existing uncommitted working-tree changes in `PythonOpet` (partial `passlib`→`bcrypt` migration in `security.py`, `reviews.py`/`review_repository.py`/`review.py` schema tweaks, `ReviewItem.tsx`, new files `seed_extra.ps1`, `seed_games.ps1`, `update_games.ps1`, `GamesContext.tsx`, `mobile/src/services/api.ts`) — build on top of them, never revert or discard them.
- `mobile/src/context/GamesContext.tsx` and `mobile/src/services/api.ts` are unfinished, unwired code (not referenced from `App.tsx`) — leave them as-is; do not wire them in or delete them.
- The mobile app's active render path (`AuthContext`, `mockData` in `HomeScreen`/`GameDetailScreen`) must keep working with zero network calls — this is what gets demoed.
- `Crud-python/PythonOpet/mobile` is the official mobile app; `Crud-python/mobile` (root, duplicate) is out of scope for this plan except for one doc note marking it obsolete.
- Every backend fix must keep existing tests passing (`pytest` in `PythonOpet/backend`, run with `DATABASE_URL_TEST` — see Task 6).
- No new abstractions beyond what each fix requires (YAGNI).

---

## Task 1: Sync backend dependency manifests (`requirements.txt` / `pyproject.toml`)

**Files:**
- Modify: `PythonOpet/backend/pyproject.toml`
- Create: `PythonOpet/backend/requirements.lock.txt`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: a `pyproject.toml` whose `dependencies` list matches what the code actually imports (already using `bcrypt` directly per the in-progress `security.py` change, not `passlib`), plus a lockfile future tasks/CI can reference.

- [ ] **Step 1: Confirm `passlib` is unused in the codebase**

Run: `cd PythonOpet/backend && grep -rn "passlib" app/`
Expected: no output (the working-tree `security.py` change already replaced passlib with raw `bcrypt`).

- [ ] **Step 2: Update `pyproject.toml` dependencies**

In `PythonOpet/backend/pyproject.toml`, in the `[project]` `dependencies` list, replace:

```toml
    "passlib[bcrypt]>=1.7.4",
```

with:

```toml
    "bcrypt>=4.0.0",
    "aiosqlite>=0.20.0",
```

(`aiosqlite` was already in `requirements.txt` for the SQLite demo mode but missing from `pyproject.toml`.)

- [ ] **Step 3: Verify parity between the two manifest files**

Run:
```bash
cd PythonOpet/backend
python - <<'EOF'
import re, tomllib
with open("pyproject.toml", "rb") as f:
    pkgs_toml = {re.split(r"[>=<\[]", d)[0].strip() for d in tomllib.load(f)["project"]["dependencies"]}
with open("requirements.txt") as f:
    pkgs_txt = {re.split(r"[>=<\[]", l)[0].strip() for l in f if l.strip() and not l.startswith("#")}
print("only in pyproject:", pkgs_toml - pkgs_txt)
print("only in requirements:", pkgs_txt - pkgs_toml)
EOF
```
Expected: `only in pyproject: set()` and `only in requirements: set()` (both manifests list the same package names — version specifiers may still differ slightly, that's fine).

- [ ] **Step 4: Generate the lockfile**

Run (inside the project's venv — activate it first if not already active):
```bash
cd PythonOpet/backend
pip install -r requirements.txt -q
pip freeze > requirements.lock.txt
```
Expected: `requirements.lock.txt` created with pinned versions (`==`) for every installed package.

- [ ] **Step 5: Add a one-line note to `PythonOpet/backend/README.md`**

Add under the "Instalação" / setup section:
```markdown
Para builds reprodutíveis, use `pip install -r requirements.lock.txt` (versões travadas). O `requirements.txt` continua sendo a fonte de verdade para ranges mínimos.
```

- [ ] **Step 6: Commit**

```bash
cd PythonOpet
git add backend/pyproject.toml backend/requirements.lock.txt backend/README.md
git commit -m "fix: sync pyproject.toml deps with requirements.txt, add lockfile"
```

---

## Task 2: Restrict CORS to configured origins

**Files:**
- Modify: `PythonOpet/backend/app/core/config.py`
- Modify: `PythonOpet/backend/main.py`
- Modify: `PythonOpet/backend/.env.example`

**Interfaces:**
- Consumes: `Settings` class from `app/core/config.py` (existing).
- Produces: `settings.cors_allow_origins: list[str]` — a new config field later tasks/deploys read to control CORS.

- [ ] **Step 1: Add the `cors_allow_origins` field to `Settings`**

In `PythonOpet/backend/app/core/config.py`, add after `app_debug: bool = False`:

```python
    cors_allow_origins: str = "http://localhost:8081,http://localhost:19006"
```

And add a property right after the `Settings` class body (before `settings = Settings()`):

```python
    @property
    def cors_allow_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]
```

(Keep this inside the `Settings` class, indented at the same level as `model_config`.)

- [ ] **Step 2: Use the new setting in `main.py`**

In `PythonOpet/backend/main.py`, replace:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

with:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- [ ] **Step 3: Document the new env var**

In `PythonOpet/backend/.env.example`, add under the `# ── Aplicação` section:

```
# Origens permitidas por CORS, separadas por vírgula (sem espaços extras).
CORS_ALLOW_ORIGINS=http://localhost:8081,http://localhost:19006
```

- [ ] **Step 4: Verify the app still starts and the health check passes**

Run:
```bash
cd PythonOpet/backend
python -c "from main import app; print(app.title)"
```
Expected: prints `Gamestar API` with no exceptions (confirms `Settings` still loads and `CORSMiddleware` accepts the list).

- [ ] **Step 5: Commit**

```bash
cd PythonOpet
git add backend/app/core/config.py backend/main.py backend/.env.example
git commit -m "fix: restrict CORS to configured origins instead of wildcard"
```

---

## Task 3: Remove private-attribute access in `get_current_user`

**Files:**
- Modify: `PythonOpet/backend/app/services/user_service.py`
- Modify: `PythonOpet/backend/app/api/dependencies.py`

**Interfaces:**
- Consumes: `AbstractUserRepository.get_by_id` (existing, used internally by `UserService`).
- Produces: `UserService.get_user_or_none(user_id: uuid.UUID) -> User | None` — a new public method `app/api/dependencies.py` calls instead of reaching into `_repo`.

- [ ] **Step 1: Add `get_user_or_none` to `UserService`**

In `PythonOpet/backend/app/services/user_service.py`, add this method (e.g. right before `get_user`):

```python
    async def get_user_or_none(self, user_id: uuid.UUID) -> User | None:
        return await self._repo.get_by_id(user_id)
```

- [ ] **Step 2: Use it in `get_current_user`**

In `PythonOpet/backend/app/api/dependencies.py`, replace:

```python
    user = await user_service._repo.get_by_id(uuid.UUID(user_id))  # noqa: SLF001
```

with:

```python
    user = await user_service.get_user_or_none(uuid.UUID(user_id))
```

- [ ] **Step 3: Run the existing unit tests**

Run: `cd PythonOpet/backend && pytest tests/unit -v`
Expected: all tests PASS (this change doesn't alter `ReviewService`, but confirms nothing broke on import).

- [ ] **Step 4: Commit**

```bash
cd PythonOpet
git add backend/app/services/user_service.py backend/app/api/dependencies.py
git commit -m "fix: add UserService.get_user_or_none, stop reaching into _repo from dependencies"
```

---

## Task 4: Remove `banco.txt`, move Azure server name to `.env.example`

**Files:**
- Delete: `PythonOpet/backend/banco.txt`
- Modify: `PythonOpet/backend/.env.example`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by other tasks — purely a cleanup.

- [ ] **Step 1: Confirm `banco.txt` is tracked by git**

Run: `cd PythonOpet && git ls-files backend/banco.txt`
Expected: prints `backend/banco.txt` (confirms it's tracked, so `git rm` is the right removal path).

- [ ] **Step 2: Fold its content into the existing Azure SQL comment block in `.env.example`**

In `PythonOpet/backend/.env.example`, the "Produção (Azure SQL)" comment block already shows a placeholder connection string. Add one line above it with the real server/database names (safe to keep as a comment — this file is committed on purpose as a template, but the value is just an endpoint hostname, not a credential):

```
# Servidor de produção: gamestartidea3.database.windows.net (banco: gamestart)
```

- [ ] **Step 3: Remove `banco.txt` from the repo**

Run:
```bash
cd PythonOpet
git rm backend/banco.txt
```

- [ ] **Step 4: Commit**

```bash
cd PythonOpet
git add backend/.env.example
git commit -m "fix: remove banco.txt, fold Azure server reference into .env.example"
```

---

## Task 5: Fail startup if demo `SECRET_KEY` is used in production

**Files:**
- Modify: `PythonOpet/backend/app/core/config.py`

**Interfaces:**
- Consumes: `Settings.app_env`, `Settings.secret_key` (existing fields).
- Produces: raises `RuntimeError` at import time if misconfigured — no new public interface for other tasks.

- [ ] **Step 1: Write a test for the validation**

Create `PythonOpet/backend/tests/unit/test_config.py`:

```python
import importlib
import os

import pytest


def _reload_config_with_env(monkeypatch: pytest.MonkeyPatch, **env: str):
    for key, value in env.items():
        monkeypatch.setenv(key, value)
    import app.core.config as config_module
    importlib.reload(config_module)
    return config_module


def test_production_with_demo_secret_key_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    with pytest.raises(RuntimeError, match="SECRET_KEY"):
        _reload_config_with_env(
            monkeypatch,
            APP_ENV="production",
            SECRET_KEY="demo-secret-key-troque-em-producao",
            DATABASE_URL="sqlite+aiosqlite:///./gamestar.db",
        )


def test_production_with_real_secret_key_succeeds(monkeypatch: pytest.MonkeyPatch) -> None:
    config_module = _reload_config_with_env(
        monkeypatch,
        APP_ENV="production",
        SECRET_KEY="a-real-64-char-random-secret-generated-with-secrets-token-hex",
        DATABASE_URL="sqlite+aiosqlite:///./gamestar.db",
    )
    assert config_module.settings.app_env == "production"
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd PythonOpet/backend && pytest tests/unit/test_config.py -v`
Expected: `test_production_with_demo_secret_key_raises` FAILS (no `RuntimeError` raised yet); `test_production_with_real_secret_key_succeeds` passes trivially.

- [ ] **Step 3: Add the validation**

In `PythonOpet/backend/app/core/config.py`, after the `Settings` class definition and before `settings = Settings()  # type: ignore[call-arg]`, add:

```python
_DEMO_SECRET_KEY = "demo-secret-key-troque-em-producao"


def _validate_production_secret(settings: Settings) -> None:
    if settings.app_env == "production" and settings.secret_key == _DEMO_SECRET_KEY:
        raise RuntimeError(
            "SECRET_KEY ainda está com o valor de demonstração. "
            "Gere uma chave real (ex.: `python -c \"import secrets; print(secrets.token_hex(32))\"`) "
            "e defina SECRET_KEY no ambiente de produção antes de iniciar a API."
        )
```

Then change the last line to:

```python
settings = Settings()  # type: ignore[call-arg]
_validate_production_secret(settings)
```

- [ ] **Step 4: Run the test again to verify it passes**

Run: `cd PythonOpet/backend && pytest tests/unit/test_config.py -v`
Expected: both tests PASS.

- [ ] **Step 5: Run the full unit test suite to check for regressions**

Run: `cd PythonOpet/backend && pytest tests/unit -v`
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
cd PythonOpet
git add backend/app/core/config.py backend/tests/unit/test_config.py
git commit -m "fix: fail startup if SECRET_KEY is still the demo value in production"
```

---

## Task 6: Make the integration test database URL configurable

**Files:**
- Modify: `PythonOpet/backend/tests/conftest.py`
- Modify: `PythonOpet/backend/README.md`

**Interfaces:**
- Consumes: nothing.
- Produces: reads `TEST_DATABASE_URL` env var (new), falling back to the existing hardcoded Postgres URL — no code elsewhere depends on this.

- [ ] **Step 1: Update `conftest.py` to read from env**

In `PythonOpet/backend/tests/conftest.py`, replace:

```python
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/game_reviews_test"
```

with:

```python
import os

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/game_reviews_test",
)
```

(Move the `import os` to the top of the file with the other imports if the file doesn't already import `os`.)

- [ ] **Step 2: Document it in the README**

In `PythonOpet/backend/README.md`, under the testing section, add:

```markdown
Os testes de integração (`tests/integration/`, atualmente vazios) esperam um Postgres
acessível via `TEST_DATABASE_URL` (padrão: `postgresql+asyncpg://postgres:postgres@localhost:5432/game_reviews_test`).
Os testes unitários (`tests/unit/`) não precisam de nenhum banco.
```

- [ ] **Step 3: Verify unit tests still pass without Postgres running**

Run: `cd PythonOpet/backend && pytest tests/unit -v`
Expected: all tests PASS (unit tests mock the repository, so they never touch `conftest.py`'s `setup_db` fixture against a real DB — this fixture only matters for the empty `tests/integration/` suite).

- [ ] **Step 4: Commit**

```bash
cd PythonOpet
git add backend/tests/conftest.py backend/README.md
git commit -m "fix: make integration test database URL configurable via TEST_DATABASE_URL"
```

---

## Task 7: Mark the root `mobile/` duplicate as obsolete

**Files:**
- Create: `Crud-python/mobile/OBSOLETE.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Add the notice**

Create `Crud-python/mobile/OBSOLETE.md`:

```markdown
# Esta pasta está obsoleta

A versão oficial do app mobile é `PythonOpet/mobile` (dentro do repositório git do
PythonOpet). Esta cópia na raiz do monorepo ficou desatualizada e não deve receber
novas alterações. Se for necessário decidir o que fazer com ela (arquivar, remover),
confirme com o responsável pelo projeto antes de apagar.
```

- [ ] **Step 2: No commit** — `Crud-python` (the outer folder) is not a git repository, so this file just exists on disk as a note. Confirm it's readable:

Run: `cat Crud-python/mobile/OBSOLETE.md` (from wherever `Crud-python` lives)
Expected: prints the file content above.

---

## Task 8: Prepare `PythonOpet/mobile` for EAS Update + EAS Build

**Files:**
- Modify: `PythonOpet/mobile/package.json`
- Modify: `PythonOpet/mobile/app.json`
- Create: `PythonOpet/mobile/eas.json`
- Create: `PythonOpet/mobile/docs/DEMO_FACULDADE.md`

**Interfaces:**
- Consumes: nothing from backend tasks — fully independent workstream.
- Produces: an `eas.json` with a `preview` build profile and an `update` channel that Task 9's manual commands (`eas update`, `eas build`) rely on by name.

- [ ] **Step 1: Add `expo-updates` as a dependency**

Run:
```bash
cd PythonOpet/mobile
npx expo install expo-updates
```
Expected: `expo-updates` added to `package.json` `dependencies` with a version compatible with Expo SDK 54, and installed into `node_modules`.

- [ ] **Step 2: Add `eas-cli` as a dev dependency (pinned, so `npx eas-cli` is reproducible)**

Run:
```bash
cd PythonOpet/mobile
npm install --save-dev eas-cli@^20
```
Expected: `eas-cli` added under `devDependencies` in `package.json`.

- [ ] **Step 3: Add the `runtimeVersion` and `updates` config to `app.json`**

In `PythonOpet/mobile/app.json`, inside the `"expo"` object, add (the `projectId` line stays as the literal placeholder text below — Task 9 Step 1 replaces it automatically when the user runs `eas init`):

```json
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/REPLACE_WITH_PROJECT_ID"
    },
    "extra": {
      "eas": {
        "projectId": "REPLACE_WITH_PROJECT_ID"
      }
    },
```

- [ ] **Step 4: Create `eas.json`**

Create `PythonOpet/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 20.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "channel": "presentation"
    }
  },
  "submit": {
    "production": {}
  }
}
```

- [ ] **Step 5: Verify the config is valid JSON and Expo can read it**

Run:
```bash
cd PythonOpet/mobile
node -e "JSON.parse(require('fs').readFileSync('eas.json', 'utf8')); JSON.parse(require('fs').readFileSync('app.json', 'utf8')); console.log('OK')"
```
Expected: prints `OK` with no parse errors.

- [ ] **Step 6: Write the day-of-demo instructions**

Create `PythonOpet/mobile/docs/DEMO_FACULDADE.md`:

```markdown
# Demo na faculdade — checklist

O app usa dados mockados (sem backend real). Nada roda no computador da faculdade —
só o seu celular precisa do Expo Go (ou do APK já instalado).

## Antes de ir (no seu notebook, com internet e sem restrições)

1. Login na Expo (uma vez só, abre o navegador):
   ```bash
   cd PythonOpet/mobile
   npx eas-cli login
   ```
2. Vincular o projeto à sua conta (preenche `projectId` em `app.json` automaticamente):
   ```bash
   npx eas-cli init
   ```
3. Publicar a versão atual via EAS Update (plano A — usa internet no celular na hora):
   ```bash
   npx eas-cli update --branch presentation --message "Demo faculdade"
   ```
   Isso imprime um link/QR. Salve o link — é permanente até você publicar de novo.
4. Gerar o APK standalone (plano B — funciona sem internet na hora da demo):
   ```bash
   npx eas-cli build --platform android --profile preview
   ```
   Aguarde o build na nuvem (alguns minutos) e baixe o `.apk` pelo link impresso ao final,
   ou pelo painel em https://expo.dev — instale no celular Android (ative "instalar de
   fontes desconhecidas" se pedido).

## Na faculdade

- **Plano A:** abra o Expo Go no celular → "Enter URL manually" → cole o link do passo 3
  (ou escaneie o QR salvo). Precisa só de internet no celular (wifi da faculdade ou dados
  móveis) — nenhuma etapa depende do computador da faculdade.
- **Plano B:** abra o app já instalado via APK — funciona sem internet.
```

- [ ] **Step 7: Commit**

```bash
cd PythonOpet
git add mobile/package.json mobile/package-lock.json mobile/app.json mobile/eas.json mobile/docs/DEMO_FACULDADE.md
git commit -m "feat: configure EAS Update + EAS Build for offline-friendly college demo"
```

---

## Task 9 (manual, human operator): Publish the update and build the APK

This task is **not automatable** — `eas login` opens an interactive browser OAuth flow
tied to the user's personal Expo account, and builds run on Expo's cloud infra under
that account's quota. Follow `PythonOpet/mobile/docs/DEMO_FACULDADE.md` (written in
Task 8, Step 6) on your own notebook before leaving for college:

- [ ] Run `npx eas-cli login` (creates a free account at expo.dev if you don't have one)
- [ ] Run `npx eas-cli init` and confirm it wrote a real `projectId` into `app.json`
      (open the file and check `REPLACE_WITH_PROJECT_ID` is gone)
- [ ] Run `npx eas-cli update --branch presentation --message "Demo faculdade"` and save
      the printed link
- [ ] Run `npx eas-cli build --platform android --profile preview`, wait for it to finish,
      and install the resulting APK on your phone
- [ ] Commit the `projectId`-filled `app.json`:
  ```bash
  cd PythonOpet
  git add mobile/app.json
  git commit -m "chore: set EAS projectId after eas init"
  ```

---

## Self-Review Notes

- **Spec coverage:** all six backend fixes from the spec (deps sync, CORS, encapsulation,
  `banco.txt`, `SECRET_KEY` validation, configurable test DB URL) map to Tasks 1–6. The
  Expo strategy (EAS Update + EAS Build, root `mobile/` marked obsolete) maps to Tasks 7–9.
- **Placeholder scan:** `REPLACE_WITH_PROJECT_ID` in Task 8 Step 3 is intentional and
  explained — `eas init` (Task 9) overwrites it automatically; it is not a plan gap.
- **Type/name consistency:** `UserService.get_user_or_none` (Task 3) is the only new
  cross-file interface; its name and signature are used identically in
  `app/api/dependencies.py`.
