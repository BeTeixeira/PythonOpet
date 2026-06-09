import uuid

from fastapi import APIRouter, HTTPException, Query, status

from app.api.dependencies import GameServiceDep
from app.domain.schemas.game import GameCreate, GameResponse, GameUpdate
from app.infrastructure.exceptions import NotFoundError

router = APIRouter(prefix="/games", tags=["games"])


@router.get("", response_model=list[GameResponse])
async def list_games(
    service: GameServiceDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> list[GameResponse]:
    games = await service.list_games(skip=skip, limit=limit)
    return [GameResponse.model_validate(g) for g in games]


@router.get("/{game_id}", response_model=GameResponse)
async def get_game(game_id: uuid.UUID, service: GameServiceDep) -> GameResponse:
    try:
        game = await service.get_game(game_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return GameResponse.model_validate(game)


@router.post("", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
async def create_game(data: GameCreate, service: GameServiceDep) -> GameResponse:
    game = await service.create_game(data)
    return GameResponse.model_validate(game)


@router.patch("/{game_id}", response_model=GameResponse)
async def update_game(
    game_id: uuid.UUID, data: GameUpdate, service: GameServiceDep
) -> GameResponse:
    try:
        game = await service.update_game(game_id, data)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return GameResponse.model_validate(game)


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_game(game_id: uuid.UUID, service: GameServiceDep) -> None:
    try:
        await service.delete_game(game_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
