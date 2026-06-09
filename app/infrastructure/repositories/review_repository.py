import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.interfaces.review_repository import AbstractReviewRepository
from app.domain.models.review import Review
from app.domain.schemas.review import ReviewCreate, ReviewUpdate


class ReviewRepository(AbstractReviewRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, review_id: uuid.UUID) -> Review | None:
        result = await self._session.execute(
            select(Review).where(Review.id == review_id)
        )
        return result.scalar_one_or_none()

    async def list_by_game(
        self, game_id: uuid.UUID, *, skip: int = 0, limit: int = 20
    ) -> list[Review]:
        result = await self._session.execute(
            select(Review)
            .where(Review.game_id == game_id)
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def list_by_user(
        self, user_id: uuid.UUID, *, skip: int = 0, limit: int = 20
    ) -> list[Review]:
        result = await self._session.execute(
            select(Review)
            .where(Review.user_id == user_id)
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create(self, user_id: uuid.UUID, data: ReviewCreate) -> Review:
        review = Review(
            user_id=user_id,
            game_id=data.game_id,
            rating=data.rating,
            body=data.body,
        )
        self._session.add(review)
        await self._session.flush()
        await self._session.refresh(review)
        return review

    async def update(self, review: Review, data: ReviewUpdate) -> Review:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(review, field, value)
        await self._session.flush()
        await self._session.refresh(review)
        return review

    async def delete(self, review: Review) -> None:
        await self._session.delete(review)
        await self._session.flush()
