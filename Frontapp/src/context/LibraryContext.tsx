import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { ApiReview, Review, mapApiReview } from "../types";
import { useAuth } from "./AuthContext";

// ============================================================
// "MINHA LISTA" do usuário logado.
//
// - Avaliações (myReviews): vêm da API (GET /api/v1/reviews/user/{id}).
// - Status do jogo (completo, jogando...): o backend ainda NÃO tem
//   esse recurso, então fica só em memória por enquanto. Quando o
//   endpoint existir, troque o useState de `statuses` por chamadas
//   à API em setStatus().
// ============================================================

export type LibraryStatus = "completo" | "jogando" | "jogar_depois" | "nao_gostei";

// TEXTO EDITÁVEL — rótulos dos status
export const STATUS_LABELS: Record<LibraryStatus, string> = {
  completo: "COMPLETO",
  jogando: "JOGANDO",
  jogar_depois: "JOGAR DEPOIS",
  nao_gostei: "NÃO GOSTEI",
};

type LibraryContextValue = {
  statuses: Record<string, LibraryStatus>;
  setStatus: (gameId: string, status: LibraryStatus | null) => void;
  myReviews: Review[];
  myReviewFor: (gameId: string) => Review | undefined;
  refreshMyReviews: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Record<string, LibraryStatus>>({});
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  const refreshMyReviews = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.get<ApiReview[]>(`/api/v1/reviews/user/${user.id}?limit=100`);
      setMyReviews(data.map(mapApiReview));
    } catch {
      // mantém a lista anterior; as telas mostram o erro ao tentar avaliar
    }
  }, [user]);

  // Troca de usuário (login/logout) zera a lista
  useEffect(() => {
    setStatuses({});
    setMyReviews([]);
    refreshMyReviews();
  }, [refreshMyReviews]);

  const setStatus = useCallback((gameId: string, status: LibraryStatus | null) => {
    setStatuses((prev) => {
      const next = { ...prev };
      if (status) next[gameId] = status;
      else delete next[gameId];
      return next;
    });
  }, []);

  const myReviewFor = useCallback(
    (gameId: string) => myReviews.find((r) => r.gameId === gameId),
    [myReviews]
  );

  const value = useMemo(
    () => ({ statuses, setStatus, myReviews, myReviewFor, refreshMyReviews }),
    [statuses, setStatus, myReviews, myReviewFor, refreshMyReviews]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary precisa estar dentro de <LibraryProvider>");
  return ctx;
}
