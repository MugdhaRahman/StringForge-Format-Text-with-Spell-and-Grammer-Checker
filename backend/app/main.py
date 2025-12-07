from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, transform, history

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Text Cleaner & Formatter')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router)
app.include_router(transform.router)
app.include_router(history.router)


@app.get('/health')
def health():
    return {'status': 'ok'}
