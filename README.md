# Gamestar

Monorepo do projeto Gamestar — plataforma de catálogo e avaliações de jogos.

## Estrutura

```
/
├── backend/   # API FastAPI (Python 3.11)
└── mobile/    # App React Native (Expo)
```

## Backend

```bash
cd backend
cp .env.example .env   # preencher as variáveis
docker compose up      # sobe API + PostgreSQL
```

A API ficará disponível em `http://localhost:8000`. Documentação interativa em `/docs`.

Para rodar as migrações separadamente:

```bash
cd backend
alembic upgrade head
```

## Mobile

```bash
cd mobile
npm install
npx expo start
```

Leia o QR code no app **Expo Go** (iOS/Android) para rodar no dispositivo.

## Deploy

O backend é publicado automaticamente no Azure Web App via GitHub Actions a cada push na branch `main`. Veja `.github/workflows/azure-webapps-node.yml` para detalhes.
