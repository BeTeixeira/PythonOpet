export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
}

export interface Game {
  id: string;
  title: string;
  developer: string;
  genre: string;
  year: number;
  rating: number;
  coverImage: string;
  description: string;
  reviews: Review[];
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  GameDetail: { initialIndex: number };
};
