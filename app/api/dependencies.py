from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.infrastructure.database import get_db_session
from app.infrastructure.repositories import GameRepository, ReviewRepository, UserRepository
from app.services import GameService, ReviewService, UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

DbSession = Annotated[AsyncSession, Depends(get_db_session)]


def get_review_service(session: DbSession) -> ReviewService:
    return ReviewService(ReviewRepository(session))


def get_user_service(session: DbSession) -> UserService:
    return UserService(UserRepository(session))


def get_game_service(session: DbSession) -> GameService:
    return GameService(GameRepository(session))


ReviewServiceDep = Annotated[ReviewService, Depends(get_review_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
GameServiceDep = Annotated[GameService, Depends(get_game_service)]


async def get_current_user_id(
    token: Annotated[str, Depends(oauth2_scheme)],
    user_service: UserServiceDep,
) -> str:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub", "")
        if not user_id:
            raise credentials_exc
    except ValueError:
        raise credentials_exc
    return user_id


CurrentUser = Annotated[str, Depends(get_current_user_id)]
