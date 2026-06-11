import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field


class GameCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    genre: str | None = Field(None, max_length=100)
    developer: str | None = Field(None, max_length=200)
    release_date: date | None = None
    description: str | None = None
    cover_image_url: str | None = Field(None, max_length=500)


class GameUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    genre: str | None = None
    developer: str | None = None
    release_date: date | None = None
    description: str | None = None
    cover_image_url: str | None = Field(None, max_length=500)


class GameResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    title: str
    genre: str | None
    developer: str | None
    release_date: date | None
    description: str | None
    cover_image_url: str | None
    created_at: datetime
