# GameStar — app mobile (React Native / Expo)

App mobile do GameStar, feito com **Expo SDK 57** e **Expo Router** (navegação
por arquivos). Conversa com a API FastAPI da pasta `backend/`: login, cadastro,
catálogo de jogos, busca e comentários/notas vêm do backend.

## Como rodar

1. Suba a API (veja o README da raiz). Ela precisa escutar na rede, não só em
   localhost, para o celular conseguir acessar:
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. Rode o app:
   ```bash
   cd Frontapp
   npm install
   npx expo start
   ```
3. Abra no celular com o app **Expo Go** (escaneando o QR code), pressione `a`
   para abrir no emulador Android, ou `w` para abrir no navegador.

O Expo Go precisa ser da mesma versão de SDK do projeto (57). O da loja já é.
No emulador, o `npx expo start` oferece instalar a versão certa sozinho.

### Endereço da API

O app descobre sozinho: usa o mesmo IP do servidor do Expo, porta 8000
(no navegador, `http://localhost:8000`). Para forçar outro endereço, crie um
arquivo `.env` nesta pasta com:

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:8000
```

## Estrutura de pastas

```
app/                    ← cada arquivo aqui é uma TELA (rota)
  _layout.tsx             layout raiz (tema, login obrigatório, navegação em pilha)
  login.tsx               Login / cadastro                → rota "/login"
  index.tsx               Catálogo + busca                → rota "/"
  biblioteca.tsx          Minha lista (filtros)           → rota "/biblioteca"
  amigos.tsx              Lista de amigos                 → rota "/amigos"
  perfil.tsx              Dados da conta + sair           → rota "/perfil"
  jogo/[id].tsx           Detalhe do jogo + comentários   → rota "/jogo/<id>"

src/
  services/api.ts         cliente HTTP da API (token, endereço, erros)
  types/index.ts          tipos do app + conversão das respostas da API
  context/
    AuthContext.tsx       login, cadastro, logout, usuário logado
    GamesContext.tsx      catálogo de jogos (GET /api/v1/games)
    LibraryContext.tsx    "Minha lista": suas avaliações + status dos jogos
  theme/
    colors.ts             paleta de cores (light/dark)
    ThemeContext.tsx      lógica do toggle claro/escuro
  data/
    friends.ts            dados dos amigos (ainda fictícios, ver abaixo)
  components/
    TopBar.tsx            barra superior com os ícones de navegação
    SearchBar.tsx         campo de busca
    GameCard.tsx          card de jogo (catálogo e minha lista)
    FriendCard.tsx        card de amigo
    FilterPills.tsx       chips de filtro/status
    StarRating.tsx        estrelas de avaliação (só leitura ou clicáveis)
```

## O que ainda NÃO vem do backend

| Funcionalidade                     | Situação hoje                                                  |
| ---------------------------------- | -------------------------------------------------------------- |
| Amigos / solicitações pendentes    | dados fictícios em `src/data/friends.ts`                        |
| Status na "Minha lista" (completo, jogando...) | guardado só em memória (`LibraryContext.tsx`) — some ao fechar o app |
| Nota dos especialistas             | aparece como "Em breve" no detalhe do jogo                      |
| Sessão de login                    | só em memória — fechar o app pede login de novo                 |

Quando os endpoints existirem, basta trocar esses pontos por chamadas em
`src/services/api.ts` — as telas não precisam mudar.

## Onde editar cada coisa

| Quero mudar...                              | Arquivo                                  |
| -------------------------------------------- | ----------------------------------------- |
| Nome/info dos amigos                         | `src/data/friends.ts`                     |
| Ícones (Ionicons)                            | qualquer `<Ionicons name="..." />` — trocar o `name` já troca o ícone. Lista completa: https://icons.expo.fyi |
| Cores do app (claro/escuro)                  | `src/theme/colors.ts`                     |
| Texto fixo de tela (títulos, placeholders)   | procure o comentário `// TEXTO EDITÁVEL` no arquivo da tela em `app/` |
| Filtros da tela "Minha lista"                | array `FILTERS` no topo de `app/biblioteca.tsx` |
| Rótulos dos status (COMPLETO, JOGANDO...)    | `STATUS_LABELS` em `src/context/LibraryContext.tsx` |

Jogos, capas e comentários vêm da API — edite pelo backend (`/docs`).

## Como adicionar navegação entre telas

O Expo Router usa **roteamento por arquivo**: o caminho do arquivo dentro de
`app/` já é a URL da tela. Não existe um arquivo central de rotas.

1. **Criar uma tela nova**: crie `app/nome-da-tela.tsx` e registre-a em
   `app/_layout.tsx` dentro do `<Stack.Protected guard={!!user}>` (assim ela
   só abre com usuário logado).
2. **Navegar até ela**:
   ```tsx
   import { useRouter } from "expo-router";
   const router = useRouter();
   router.push("/nome-da-tela");     // empilha (o "voltar" retorna)
   router.replace("/nome-da-tela");  // troca a tela atual (usado na TopBar)
   ```
3. **Telas com parâmetro** (como o detalhe do jogo): nomeie o arquivo com
   colchetes, ex. `app/jogo/[id].tsx`, navegue com
   `router.push(\`/jogo/${id}\`)`, e leia o parâmetro dentro da tela com
   `useLocalSearchParams()`.
