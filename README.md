# Finance Manager

Finance Manager is a simple full-stack application for tracking categories and transactions.
The backend is built with FastAPI and SQLite, and the frontend is a React application located in `finance-frontend/`.

## Project Structure

- `main.py` — FastAPI application entry point
- `models.py` — SQLAlchemy ORM models
- `schemas.py` — Pydantic request/response schemas
- `crud.py` — database access functions
- `database.py` — SQLAlchemy database setup
- `config.py` — application configuration and environment loading
- `requirements.txt` — Python dependencies
- `finance-frontend/` — React frontend application

## Requirements

- Python 3.11+ (or compatible Python 3.x)
- Node.js 18+ and npm 10+ for the frontend
- For complete running local website you need two terminals

## Backend Setup

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

2. (Optional) Configure a custom database URL in `.env`:

```env
DATABASE_URL=sqlite:///./test.db
```

3. Start the backend server:

```bash
uvicorn main:app --reload
```

By default, the backend listens at `http://127.0.0.1:8000`.

## Frontend Setup

1. Install frontend dependencies:

```bash
cd finance-frontend
npm install
```

2. Copy the example environment file and configure the backend URL:

```bash
cp .env.example .env
```

3. Start the frontend:

```bash
npm start
```

The frontend will typically open at `http://localhost:3000`.

## API Endpoints

The backend exposes the following endpoints:

- `GET /categories/` — fetch available categories
- `GET /transactions/` — fetch transaction list
- `POST /transactions/` — create a new transaction
- `DELETE /transactions/{transaction_id}` — delete a transaction by ID

## Notes

- The backend includes CORS support for `http://localhost:3000`.
- The default database is SQLite, stored in `test.db` unless overridden.
- The frontend and backend should both be running for the full app to work.
