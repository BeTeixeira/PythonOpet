# PythonOpet — Game Reviews API

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Deploy](https://img.shields.io/badge/Cloud_Ready-005571?style=for-the-badge&logo=linux&logoColor=white)

> API RESTful para cadastro e avaliação de jogos — CRUD completo de Usuários, Jogos e Avaliações, construída com **FastAPI**, **SQLAlchemy assíncrono** e **Clean Architecture**.

---

## 📖 Visão Geral

Este projeto é uma API back-end desenvolvida em **Python 3.11+**, projetada para rodar de forma escalável em ambiente Cloud. Aplica rigorosamente os princípios **SOLID** e o padrão **Clean Architecture**, separando o sistema em camadas independentes para garantir código sustentável, testável e de fácil manutenção.

<details>
<summary><strong>🎯 Ideia principal (Clique para expandir)</strong></summary>
<br>

O sistema permite que usuários cadastrados organizem e avaliem jogos com uma nota de **1 a 10**, além de escrever um texto de resenha. Cada usuário pode publicar apenas **uma avaliação por jogo** (regra garantida no banco de dados).

As três entidades principais são:

- **Usuários** — cadastro, autenticação via JWT e gerenciamento de perfil.
- **Jogos** — catálogo com título, gênero, desenvolvedora, data de lançamento e descrição.
- **Avaliações** — nota (1–10) e resenha textual, vinculadas a um usuário e a um jogo.

</details>

---

## 🛠️ Stack Tecnológica e Princípios

* **Linguagem Core:** Python 3.11+
* **Framework Web:** [FastAPI](https://fastapi.tiangolo.com/) — alto desempenho, documentação OpenAPI automática.
* **Banco de Dados:** PostgreSQL 16 via **SQLAlchemy 2.x (async)** com driver `asyncpg`.
* **Migrações:** Alembic (modo assíncrono).
* **Validação:** Pydantic v2 com tipagem forte em todas as camadas.
* **Autenticação:** JWT (HS256) + bcrypt para hash de senhas.
* **Configuração:** `pydantic-settings` — zero credenciais hardcoded (12-Factor App).
* **Padrões de Projeto:** **Clean Architecture** + **SOLID** — camadas `domain`, `services`, `infrastructure` e `api` completamente desacopladas.
* **Observabilidade:** Logging estruturado em JSON, pronto para **AWS CloudWatch** e **GCP Cloud Logging**.
* **Isolamento:** Docker (multi-stage build, usuário não-root) + `docker compose`.

---

## 📁 Estrutura do Projeto

```
PythonOpet/
├── main.py                          # Ponto de entrada FastAPI + handlers globais
├── pyproject.toml                   # Dependências + configuração de ferramentas
├── alembic.ini                      # Configuração do Alembic
├── Dockerfile                       # Build multi-stage, imagem enxuta e segura
├── docker-compose.yml               # Orquestração: API + PostgreSQL + migrate
├── .env.example                     # Template de variáveis de ambiente
│
├── app/
│   ├── core/
│   │   ├── config.py                # Settings carregados do ambiente (pydantic-settings)
│   │   ├── security.py              # Geração/validação JWT e hash bcrypt
│   │   └── logging.py               # Logging estruturado JSON
│   │
│   ├── domain/                      # Camada mais interna — sem dependências externas
│   │   ├── models/                  # Modelos ORM: User, Game, Review
│   │   ├── schemas/                 # Schemas Pydantic: Create / Update / Response
│   │   └── interfaces/              # ABCs (contratos) dos repositórios
│   │
│   ├── services/                    # Regras de negócio: UserService, GameService, ReviewService
│   │
│   ├── infrastructure/
│   │   ├── database.py              # Engine async, session factory e Base ORM
│   │   ├── exceptions.py            # NotFoundError, ConflictError, ForbiddenError
│   │   └── repositories/            # Implementações concretas dos repositórios
│   │
│   └── api/v1/
│       ├── dependencies.py          # Injeção de dependências (DI via FastAPI)
│       ├── router.py                # Agrega todos os endpoints em /api/v1
│       └── endpoints/               # auth.py, users.py, games.py, reviews.py
│
├── migrations/
│   └── env.py                       # Alembic configurado para async
│
└── tests/
    ├── conftest.py                  # Fixtures: banco de teste + client HTTPX
    └── unit/
        └── test_review_service.py   # Testes unitários com mocks (sem banco)
```

---

## ⚙️ Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha os valores:

| Variável | Descrição | Padrão |
|---|---|---|
| `SECRET_KEY` | Chave secreta para assinar JWTs | — (obrigatório) |
| `DATABASE_URL` | URL de conexão PostgreSQL async | — (obrigatório) |
| `ALGORITHM` | Algoritmo do JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Validade do token em minutos | `30` |
| `APP_ENV` | Ambiente da aplicação | `development` |
| `APP_DEBUG` | Ativa logs SQL do SQLAlchemy | `false` |
| `LOG_LEVEL` | Nível de log | `INFO` |
| `LOG_JSON` | Emite logs em JSON (produção) | `false` |

---

## 🚀 Instalação e Execução

### Com Docker (recomendado)

```bash
# 1. Copiar e configurar variáveis de ambiente
cp .env.example .env
# edite .env e defina SECRET_KEY

# 2. Subir toda a infraestrutura (API + banco + migrate)
docker compose up --build
```

A API estará disponível em `http://localhost:8000`.

### Localmente (sem Docker)

```bash
# 1. Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows

# 2. Instalar dependências
pip install -e ".[dev]"

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Gerar e aplicar a primeira migração
alembic revision --autogenerate -m "initial"
alembic upgrade head

# 5. Iniciar o servidor
uvicorn main:app --reload
```

---

## 🗺️ Endpoints da API

A documentação interativa (Swagger UI) fica disponível em `http://localhost:8000/docs`.

<details>
<summary><strong>📋 Lista completa de endpoints (Clique para expandir)</strong></summary>
<br>

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/token` | Login — retorna JWT | ❌ |
| `GET` | `/api/v1/users` | Listar usuários | ❌ |
| `POST` | `/api/v1/users` | Criar usuário | ❌ |
| `GET` | `/api/v1/users/{id}` | Detalhar usuário | ❌ |
| `PATCH` | `/api/v1/users/{id}` | Atualizar usuário | ❌ |
| `DELETE` | `/api/v1/users/{id}` | Deletar usuário | ❌ |
| `GET` | `/api/v1/games` | Listar jogos | ❌ |
| `POST` | `/api/v1/games` | Cadastrar jogo | ❌ |
| `GET` | `/api/v1/games/{id}` | Detalhar jogo | ❌ |
| `PATCH` | `/api/v1/games/{id}` | Atualizar jogo | ❌ |
| `DELETE` | `/api/v1/games/{id}` | Deletar jogo | ❌ |
| `GET` | `/api/v1/reviews/game/{game_id}` | Avaliações de um jogo | ❌ |
| `GET` | `/api/v1/reviews/user/{user_id}` | Avaliações de um usuário | ❌ |
| `GET` | `/api/v1/reviews/{id}` | Detalhar avaliação | ❌ |
| `POST` | `/api/v1/reviews` | Criar avaliação | ✅ JWT |
| `PATCH` | `/api/v1/reviews/{id}` | Editar avaliação (dono) | ✅ JWT |
| `DELETE` | `/api/v1/reviews/{id}` | Deletar avaliação (dono) | ✅ JWT |
| `GET` | `/health` | Health check | ❌ |

</details>

---

## 🧪 Testes

```bash
# Testes unitários (sem banco de dados)
pytest tests/unit -v

# Todos os testes com cobertura
pytest --cov=app --cov-report=term-missing
```

---

## 🐳 Deploy em Cloud

O projeto segue os princípios do **12-Factor App**:

- **Configuração via ambiente** — nenhuma credencial no código-fonte.
- **Logs para stdout** — com `LOG_JSON=true`, os logs são emitidos em JSON estruturado, prontos para ingestão no **AWS CloudWatch**, **GCP Cloud Logging** ou qualquer agregador compatível.
- **Imagem Docker segura** — build multi-stage reduz o tamanho final; processo roda como usuário não-root (`appuser`).
- **Health check** — endpoint `GET /health` para uso com ALB, Cloud Run, Kubernetes, etc.

