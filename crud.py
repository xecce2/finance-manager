from sqlalchemy.orm import Session
from datetime import datetime
import models
import schemas


def get_categories(db: Session):
    return db.query(models.Category).all()


def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).offset(skip).limit(limit).all()


def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    # 1. Поиск или создание категории
    db_category = db.query(models.Category).filter(models.Category.name == transaction.category_name).first()
    if not db_category:
        db_category = models.Category(name=transaction.category_name)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)

    # 2. Конвертация даты из строки в объект
    transaction_date = datetime.strptime(transaction.date, "%Y-%m-%d").date()

    # 3. Создание записи
    db_transaction = models.Transaction(
        amount=transaction.amount,
        description=transaction.description,
        date=transaction_date,
        category_id=db_category.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db: Session, transaction_id: int):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
        return True
    return False

def delete_transaction(db: Session, transaction_id: int):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
        return True
    return False