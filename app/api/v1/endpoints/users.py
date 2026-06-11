import uuid

from fastapi import APIRouter, HTTPException, Query, status

from app.api.dependencies import AdminUser, CurrentUserFull, UserServiceDep
from app.domain.models.user import User
from app.domain.schemas.user import UserCreate, UserResponse, UserUpdate
from app.infrastructure.exceptions import ConflictError, ForbiddenError, NotFoundError

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
async def list_users(
    service: UserServiceDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> list[UserResponse]:
    users = await service.list_users(skip=skip, limit=limit)
    return [UserResponse.model_validate(u) for u in users]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: uuid.UUID, service: UserServiceDep) -> UserResponse:
    try:
        user = await service.get_user(user_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return UserResponse.model_validate(user)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(data: UserCreate, service: UserServiceDep) -> UserResponse:
    try:
        user = await service.create_user(data)
    except ConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))
    return UserResponse.model_validate(user)


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: uuid.UUID,
    data: UserUpdate,
    service: UserServiceDep,
    current_user: CurrentUserFull,
) -> UserResponse:
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile.",
        )
    try:
        user = await service.update_user(user_id, data)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return UserResponse.model_validate(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: uuid.UUID,
    service: UserServiceDep,
    _admin: AdminUser,
) -> None:
    try:
        await service.delete_user(user_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
