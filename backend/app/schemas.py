from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=100)


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class HistoryBase(BaseModel):
    original_text: str
    result_text: str
    type: str


class HistoryItem(HistoryBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class TransformRequest(BaseModel):
    text: str = Field(min_length=1)


class TransformResponse(BaseModel):
    result: str
