import uuid
import logging

from app.domain.interfaces.game_repository import AbstractGameRepository
from app.domain.models.game import Game
from app.domain.schemas.game import GameCreate, GameUpdate
from app.infrastructure.exceptions import NotFoundError

logger = logging.getLogger(__name__)


class GameService:
    def __init__(self, repository: AbstractGameRepository) -> None:
        self._repo = repository

    async def get_game(self, game_id: uuid.UUID) -> Game:
        game = await self._repo.get_by_id(game_id)
        if not game:
            raise NotFoundError("Game", game_id)
        return game

    async def list_games(self, *, skip: int = 0, limit: int = 20) -> list[Game]:
        return await self._repo.list_all(skip=skip, limit=limit)

    async def create_game(self, data: GameCreate) -> Game:
        game = await self._repo.create(data)
        logger.info("Game created: id=%s title=%s", game.id, game.title)
        return game

    async def update_game(self, game_id: uuid.UUID, data: GameUpdate) -> Game:
        game = await self.get_game(game_id)
        updated = await self._repo.update(game, data)
        logger.info("Game updated: id=%s", game_id)
        return updated

    async def delete_game(self, game_id: uuid.UUID) -> None:
        game = await self.get_game(game_id)
        await self._repo.delete(game)
        logger.info("Game deleted: id=%s", game_id)
