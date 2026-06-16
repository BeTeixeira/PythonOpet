# Gamestar

Monorepo do projeto Gamestar — plataforma de catálogo e avaliações de jogos.

```
/
├── backend/   # API FastAPI (Python 3.11)
└── mobile/    # App React Native (Expo)
```

> 🎮 **Modo demonstração:** por padrão, tanto a API quanto o app mobile rodam **sem nenhuma conexão externa** (sem Docker, sem Azure, sem internet). A API usa um arquivo SQLite local e o app mobile usa dados fictícios em memória — ideal para abrir o projeto, mostrar a tela de documentação (`/docs`) e navegar pelo app numa apresentação. A lógica de produção (Azure SQL, GitHub OAuth, deploy) continua no projeto, só comentada/desligada — veja [Modo produção](#-modo-produção-referência).

---

## ✅ Pré-requisitos

Instale antes de começar (uma vez só, no seu PC):

| Ferramenta | Para quê | Link |
|---|---|---|
| **VSCode** | Editor usado neste guia | https://code.visualstudio.com |
| **Python 3.11+** | Rodar a API | https://www.python.org/downloads/ |
| **Node.js 18 LTS+** | Rodar o app mobile | https://nodejs.org |
| **Git** | Baixar/clonar o projeto | https://git-scm.com |
| **App "Expo Go"** (no celular) | Ver o app mobile funcionando | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779) |

Ao instalar o Python e o Node, marque a opção **"Add to PATH"** se o instalador perguntar — assim os comandos funcionam no terminal.

---

## 📂 Abrindo o projeto no VSCode

1. Abra o **VSCode**.
2. Vá em **File → Open Folder...** e selecione a pasta raiz do projeto (a que contém as pastas `backend` e `mobile`).
3. Se o VSCode sugerir instalar a extensão **Python** (da Microsoft), clique em **Install** — ela ajuda a rodar e debugar o código Python.
4. Abra o terminal integrado: menu **Terminal → New Terminal** (ou `` Ctrl+` ``). Todos os comandos abaixo são digitados nesse terminal.

---

## 🔙 1. Rodando a API localmente

A API roda 100% local, sem precisar de Docker nem de banco de dados externo — usa um arquivo SQLite (`gamestar.db`) criado automaticamente na primeira execução.

No terminal do VSCode:

```bash
cd backend

# 1. Cria um ambiente virtual isolado para as dependências do projeto
python -m venv .venv

# 2. Ativa o ambiente virtual
.venv\Scripts\activate        # Windows (PowerShell ou cmd)
# source .venv/bin/activate   # Mac/Linux

# 3. Instala as dependências
pip install -r requirements.txt

# 4. Copia o arquivo de configuração de exemplo
copy .env.example .env        # Windows
# cp .env.example .env        # Mac/Linux

# 5. Cria as tabelas no banco SQLite local
alembic upgrade head

# 6. Inicia a API
uvicorn main:app --reload
```

Se tudo correu bem, o terminal vai mostrar algo como `Uvicorn running on http://127.0.0.1:8000`.

Abra no navegador: **http://localhost:8000/docs** — é a documentação interativa (Swagger UI) gerada automaticamente pelo FastAPI, onde dá para ver e testar todos os endpoints da API.

> 💡 Dica VSCode: depois da primeira vez, o VSCode geralmente detecta o `.venv` e oferece para selecioná-lo como interpretador Python do projeto (canto inferior direito ou `Ctrl+Shift+P` → "Python: Select Interpreter"). Selecione o que está dentro de `backend/.venv`.

Para parar a API, vá no terminal e pressione `Ctrl+C`.

---

## 📱 2. Rodando o app mobile

O app mobile roda **totalmente offline**: login, lista de jogos, avaliações — tudo com dados fictícios guardados em memória, sem chamar a API nem precisar dela rodando. É só para fins de demonstração visual; nada é salvo entre uma execução e outra.

Em um **novo terminal** (deixe a API rodando no outro, se quiser, mas não é obrigatório):

```bash
cd mobile
npm install
npx expo start
```

Vai aparecer um **QR code** no terminal. Para testar:

- **No celular:** abra o app **Expo Go** e escaneie o QR code (Android: opção de escanear dentro do próprio app; iOS: pela câmera nativa).
- **No emulador Android:** com o terminal do Expo aberto, pressione `a`.
- **No navegador:** pressione `w` (algumas telas/animações podem não funcionar 100% no modo web).

Na tela inicial do app, toque em **"Entrar como Usuário"** ou **"Entrar como Administrador"** — o login é instantâneo (não faz nenhuma requisição de rede) e mostra as funcionalidades de cada papel (RBAC):

- **Usuário:** navega pelo catálogo, lê e escreve avaliações.
- **Administrador:** vê o badge "ADMIN" e os botões de criar/editar/remover jogos (ações sem efeito real, pois é modo demonstração).

---

## 🗂️ Estrutura do projeto

```
backend/
├── main.py              # ponto de entrada da API
├── app/
│   ├── core/             config, segurança, logging
│   ├── domain/            models, schemas, interfaces
│   ├── services/          regras de negócio
│   ├── infrastructure/    banco de dados, repositórios
│   └── api/v1/            endpoints: auth, users, games, reviews
└── migrations/             arquivos do Alembic

mobile/
├── App.tsx
└── src/
    ├── context/AuthContext.tsx   # login mockado (sem rede)
    ├── data/mockData.ts          # catálogo de jogos fictício
    ├── navigation/AppNavigator.tsx
    ├── screens/                  Login, Home, GameDetail
    └── components/
```

---

## ⚙️ Variáveis de ambiente (backend)

Ficam no arquivo `backend/.env` (criado a partir de `.env.example` no passo 4 acima). Não precisa alterar nada para a demonstração local — os valores padrão já funcionam.

| Variável | Para quê | Padrão (demo) |
|---|---|---|
| `SECRET_KEY` | Assina os tokens JWT | valor de exemplo incluso |
| `DATABASE_URL` | Conexão com o banco | SQLite local (`./gamestar.db`) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Login real via GitHub OAuth | vazio (opcional) |

---

## 🚀 Modo produção (referência)

O projeto também está preparado para rodar com banco **Azure SQL**, autenticação **GitHub OAuth** real e deploy automático via **GitHub Actions** para um **Azure Web App** (usando Docker). Essa configuração não é necessária para rodar a demonstração local — fica comentada em `backend/.env.example` e descrita em [`backend/README.md`](backend/README.md), caso o projeto precise ser implantado novamente no futuro.

---

## 🧪 Testes (API)

```bash
cd backend
pytest tests/unit -v
pytest --cov=app --cov-report=term-missing
```
