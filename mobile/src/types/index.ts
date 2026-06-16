export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Review {
  id: string;
  userId: string;
  author: string;
  rating: number; // 1–5 estrelas
  body: string;
  date: string;
}

export interface Game {
  id: string;
  title: string;
  developer: string;
  genre: string;
  year: number;
  rating: number; // 0–5, média calculada das reviews
  coverImage: string;
  description: string;
  reviews: Review[];
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  GameDetail: { initialIndex: number };
};

// ── Formatos de resposta da API ────────────────────────

export interface ApiGame {
  id: string;
  title: string;
  genre: string | null;
  developer: string | null;
  release_date: string | null;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export interface ApiReview {
  id: string;
  user_id: string;
  game_id: string;
  rating: number; // 1–10 no backend
  body: string | null;
  username: string | null;
  created_at: string;
  updated_at: string;
}

// ── Funções de mapeamento ──────────────────────────────

export function mapApiGame(g: ApiGame): Game {
  return {
    id: g.id,
    title: g.title,
    developer: g.developer ?? 'Desconhecido',
    genre: g.genre ?? '',
    year: g.release_date ? parseInt(g.release_date.split('-')[0], 10) : 0,
    rating: 0,
    coverImage: g.cover_image_url ?? '',
    description: g.description ?? '',
    reviews: [],
  };
}

export function mapApiReview(r: ApiReview): Review {
  return {
    id: r.id,
    userId: r.user_id,
    author: r.username ?? 'Usuário',
    // backend usa escala 1–10, frontend exibe 1–5 estrelas
    rating: Math.max(1, Math.round(r.rating / 2)),
    body: r.body ?? '',
    date: r.created_at.split('T')[0],
  };
}
