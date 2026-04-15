from pydantic import BaseModel
from typing import List, Union
from datetime import date

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        orm_mode = True
        from_attributes = True

class TransactionBase(BaseModel):
    amount: float
    description: str
    date: Union[str, date]

class TransactionCreate(TransactionBase):
    category_name: str

class Transaction(TransactionBase):
    id: int
    category_id: int
    class Config:
        orm_mode = True
        from_attributes = True