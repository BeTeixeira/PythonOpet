import uuid

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.interfaces.game_repository import AbstractGameRepository
from app.domain.models.game import Game
from app.domain.schemas.game import GameCreate, GameUpdate


class GameRepository(AbstractGameRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, game_id: uuid.UUID) -> Game | None:
        result = await self._session.execute(select(Game).where(Game.id == game_id))
        return result.scalar_one_or_none()

    async def list_all(self, *, skip: int = 0, limit: int = 20) -> list[Game]:
        result = await self._session.execute(
            select(Game).order_by(Game.title).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def search(self, query: str, *, skip: int = 0, limit: int = 20) -> list[Game]:
        pattern = f"%{query}%"
        result = await self._session.execute(
            select(Game)
            .where(
                or_(
                    Game.title.ilike(pattern),
                    Game.developer.ilike(pattern),
                    Game.genre.ilike(pattern),
                )
            )
            .order_by(Game.title)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, data: GameCreate) -> Game:
        game = Game(**data.model_dump())
        self._session.add(game)
        await self._session.flush()
        await self._session.refresh(game)
        return game

    async def update(self, game: Game, data: GameUpdate) -> Game:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(game, field, value)
        await self._session.flush()
        await self._session.refresh(game)
        return game

    async def delete(self, game: Game) -> None:
        await self._session.delete(game)
        await self._session.flush()
