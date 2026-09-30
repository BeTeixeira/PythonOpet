// ============================================================
// DADOS DOS JOGOS — EDITE AQUI para mudar textos, notas e imagens.
//
// Esse arquivo simula o que futuramente virá de uma API/banco de
// dados. Por enquanto, é só editar os valores abaixo.
//
// COMO TROCAR A IMAGEM DE UM JOGO:
//   1) Coloque o arquivo de imagem dentro de /assets (ex: assets/nebula.png)
//   2) Troque `image: null` por `image: require("../../assets/nebula.png")`
//   Se preferir usar uma imagem da internet, use:
//   `image: { uri: "https://exemplo.com/capa.png" }`
// ============================================================

export type GameStatus =
  | "completo"
  | "jogando"
  | "jogar_depois"
  | "avaliado"
  | "nao_avaliado"
  | "nao_gostei";

export type Comment = {
  id: string;
  author: string; // TEXTO EDITÁVEL — nome de quem comentou
  text: string; // TEXTO EDITÁVEL — comentário
};

export type Game = {
  id: string;
  title: string; // TEXTO EDITÁVEL — nome do jogo
  genre: string; // TEXTO EDITÁVEL — aparece como subtítulo no catálogo
  image: any; // ÍCONE/IMAGEM — veja instruções acima
  synopsis: string; // TEXTO EDITÁVEL — texto da tela de detalhe
  ratingGeral: number; // nota da comunidade (0 a 5)
  ratingEspecialistas: number; // nota dos especialistas (0 a 5)
  myRating: number; // sua nota pessoal, usada na tela "Minha lista"
  myComment: string; // TEXTO EDITÁVEL — seu comentário, tela "Minha lista"
  status: GameStatus; // usado para os filtros da tela "Minha lista"
  comments: Comment[]; // lista de comentários da tela de detalhe
};

export const games: Game[] = [
  {
    id: "1",
    title: "Jogo A",
    genre: "Informações rápidas",
    image: null,
    synopsis:
      "Sinopse do jogo A. Troque este texto pela descrição real do jogo.",
    ratingGeral: 4,
    ratingEspecialistas: 4,
    myRating: 3,
    myComment: "Meu comentário",
    status: "completo",
    comments: [
      { id: "c1", author: "Nome do perfil", text: "Comentário da pessoa" },
    ],
  },
  {
    id: "2",
    title: "Jogo B",
    genre: "Informações rápidas",
    image: null,
    synopsis:
      "Sinopse do jogo B. Troque este texto pela descrição real do jogo.",
    ratingGeral: 4,
    ratingEspecialistas: 3,
    myRating: 4,
    myComment: "Meu comentário",
    status: "jogando",
    comments: [
      { id: "c1", author: "Nome do perfil", text: "Comentário da pessoa" },
    ],
  },
  {
    id: "3",
    title: "Jogo C",
    genre: "Informações rápidas",
    image: null,
    synopsis:
      "Sinopse do jogo C. Troque este texto pela descrição real do jogo.",
    ratingGeral: 3,
    ratingEspecialistas: 4,
    myRating: 3,
    myComment: "Meu comentário",
    status: "avaliado",
    comments: [],
  },
  {
    id: "4",
    title: "Jogo D",
    genre: "Informações rápidas",
    image: null,
    synopsis:
      "Sinopse do jogo D. Troque este texto pela descrição real do jogo.",
    ratingGeral: 5,
    ratingEspecialistas: 4,
    myRating: 4,
    myComment: "Meu comentário",
    status: "jogar_depois",
    comments: [],
  },
];
