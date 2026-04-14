from pydantic import BaseModel
from datetime import date
from typing import Optional

class TransactionBase(BaseModel):
    amount: float
    description: str
    date: date
    category_id: int

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int

    class Config:
        orm_mode = True

class Category(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True