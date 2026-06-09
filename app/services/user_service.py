import uuid
import logging

from app.domain.interfaces.user_repository import AbstractUserRepository
from app.domain.models.user import User
from app.domain.schemas.user import UserCreate, UserUpdate
from app.infrastructure.exceptions import ConflictError, NotFoundError

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, repository: AbstractUserRepository) -> None:
        self._repo = repository

    async def get_user(self, user_id: uuid.UUID) -> User:
        user = await self._repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        return user

    async def list_users(self, *, skip: int = 0, limit: int = 20) -> list[User]:
        return await self._repo.list_all(skip=skip, limit=limit)

    async def create_user(self, data: UserCreate) -> User:
        if await self._repo.get_by_email(data.email):
            raise ConflictError(f"Email '{data.email}' is already registered.")
        if await self._repo.get_by_username(data.username):
            raise ConflictError(f"Username '{data.username}' is already taken.")
        user = await self._repo.create(data)
        logger.info("User created: id=%s email=%s", user.id, user.email)
        return user

    async def update_user(self, user_id: uuid.UUID, data: UserUpdate) -> User:
        user = await self.get_user(user_id)
        updated = await self._repo.update(user, data)
        logger.info("User updated: id=%s", user_id)
        return updated

    async def delete_user(self, user_id: uuid.UUID) -> None:
        user = await self.get_user(user_id)
        await self._repo.delete(user)
        logger.info("User deleted: id=%s", user_id)
