from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud  
import models
import schemas
import database

app = FastAPI()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=database.engine)

@app.get("/categories/", response_model=list[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

@app.get("/transactions/", response_model=list[schemas.Transaction])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_transactions(db, skip=skip, limit=limit)

@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.create_transaction(db, transaction)