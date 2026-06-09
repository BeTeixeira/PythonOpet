import uuid
from abc import ABC, abstractmethod

from app.domain.models.game import Game
from app.domain.schemas.game import GameCreate, GameUpdate


class AbstractGameRepository(ABC):
    @abstractmethod
    async def get_by_id(self, game_id: uuid.UUID) -> Game | None: ...

    @abstractmethod
    async def list_all(self, *, skip: int = 0, limit: int = 20) -> list[Game]: ...

    @abstractmethod
    async def create(self, data: GameCreate) -> Game: ...

    @abstractmethod
    async def update(self, game: Game, data: GameUpdate) -> Game: ...

    @abstractmethod
    async def delete(self, game: Game) -> None: ...
