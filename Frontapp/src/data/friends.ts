// ============================================================
// DADOS DOS AMIGOS — EDITE AQUI para mudar nomes, informações e avatar.
//
// COMO TROCAR O AVATAR DE UM AMIGO:
//   igual às imagens dos jogos — troque `avatar: null` por
//   `avatar: require("../../assets/minha-imagem.png")` ou
//   `avatar: { uri: "https://exemplo.com/foto.png" }`
// ============================================================

export type Friend = {
  id: string;
  name: string; // TEXTO EDITÁVEL — nome do amigo
  info: string; // TEXTO EDITÁVEL — subtítulo (ex: "5 jogos em comum")
  avatar: any; // ÍCONE/IMAGEM — veja instruções acima
};

export const friends: Friend[] = [
  { id: "1", name: "Nome do amigo", info: "Informações do amigo", avatar: null },
  { id: "2", name: "Nome do amigo", info: "Informações do amigo", avatar: null },
  { id: "3", name: "Nome do amigo", info: "Informações do amigo", avatar: null },
  { id: "4", name: "Nome do amigo", info: "Informações do amigo", avatar: null },
];

// Lista separada para a aba "Solicitações pendentes".
// Estrutura igual à de cima — edite ou adicione itens do mesmo jeito.
export const pendingRequests: Friend[] = [
  { id: "5", name: "Nome do amigo", info: "Informações do amigo", avatar: null },
];
