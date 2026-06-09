import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.domain.schemas.review import ReviewCreate, ReviewUpdate
from app.infrastructure.exceptions import ForbiddenError, NotFoundError
from app.services.review_service import ReviewService


def _make_review(user_id: uuid.UUID, game_id: uuid.UUID) -> MagicMock:
    review = MagicMock()
    review.id = uuid.uuid4()
    review.user_id = user_id
    review.game_id = game_id
    review.rating = 8
    return review


@pytest.fixture
def repo() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def service(repo: AsyncMock) -> ReviewService:
    return ReviewService(repo)


async def test_get_review_not_found(service: ReviewService, repo: AsyncMock) -> None:
    repo.get_by_id.return_value = None
    with pytest.raises(NotFoundError):
        await service.get_review(uuid.uuid4())


async def test_create_review(service: ReviewService, repo: AsyncMock) -> None:
    user_id = uuid.uuid4()
    game_id = uuid.uuid4()
    fake = _make_review(user_id, game_id)
    repo.create.return_value = fake

    data = ReviewCreate(game_id=game_id, rating=9)
    result = await service.create_review(user_id, data)

    repo.create.assert_awaited_once_with(user_id, data)
    assert result is fake


async def test_update_review_forbidden(service: ReviewService, repo: AsyncMock) -> None:
    owner_id = uuid.uuid4()
    other_id = uuid.uuid4()
    fake = _make_review(owner_id, uuid.uuid4())
    repo.get_by_id.return_value = fake

    with pytest.raises(ForbiddenError):
        await service.update_review(fake.id, other_id, ReviewUpdate(rating=5))


async def test_delete_review_forbidden(service: ReviewService, repo: AsyncMock) -> None:
    owner_id = uuid.uuid4()
    other_id = uuid.uuid4()
    fake = _make_review(owner_id, uuid.uuid4())
    repo.get_by_id.return_value = fake

    with pytest.raises(ForbiddenError):
        await service.delete_review(fake.id, other_id)
