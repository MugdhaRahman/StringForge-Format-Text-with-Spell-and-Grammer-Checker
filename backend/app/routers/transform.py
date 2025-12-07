from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.services.text_service import TextService
from app.services import auth_service

router = APIRouter(prefix='/api', tags=['transform'])
text_service = TextService()
optional_oauth2 = OAuth2PasswordBearer(tokenUrl='/auth/login', auto_error=False)


def get_optional_user(db: Session = Depends(get_db), token: str | None = Depends(optional_oauth2)) -> models.User | None:
    if not token:
        return None
    try:
        payload = auth_service.jwt.decode(token, auth_service.SECRET_KEY, algorithms=[auth_service.ALGORITHM])
        username: str | None = payload.get('sub')
    except auth_service.JWTError:
        return None
    if not username:
        return None
    return db.query(models.User).filter(models.User.username == username).first()


def maybe_save_history(db: Session, user: models.User | None, original: str, result: str, t_type: str):
    if not user:
        return
    history = models.History(user_id=user.id, original_text=original, result_text=result, type=t_type)
    db.add(history)
    db.commit()


@router.post('/clean', response_model=schemas.TransformResponse)
def clean(payload: schemas.TransformRequest, db: Session = Depends(get_db), user: models.User | None = Depends(get_optional_user)):
    result = text_service.clean(payload.text)
    maybe_save_history(db, user, payload.text, result, 'clean')
    return {'result': result}


@router.post('/slug', response_model=schemas.TransformResponse)
def slug(payload: schemas.TransformRequest, db: Session = Depends(get_db), user: models.User | None = Depends(get_optional_user)):
    result = text_service.slug(payload.text)
    maybe_save_history(db, user, payload.text, result, 'slug')
    return {'result': result}


@router.post('/case/camel', response_model=schemas.TransformResponse)
def camel(payload: schemas.TransformRequest, db: Session = Depends(get_db), user: models.User | None = Depends(get_optional_user)):
    result = text_service.to_camel(payload.text)
    maybe_save_history(db, user, payload.text, result, 'camel')
    return {'result': result}


@router.post('/case/snake', response_model=schemas.TransformResponse)
def snake(payload: schemas.TransformRequest, db: Session = Depends(get_db), user: models.User | None = Depends(get_optional_user)):
    result = text_service.to_snake(payload.text)
    maybe_save_history(db, user, payload.text, result, 'snake')
    return {'result': result}


@router.post('/case/title', response_model=schemas.TransformResponse)
def title(payload: schemas.TransformRequest, db: Session = Depends(get_db), user: models.User | None = Depends(get_optional_user)):
    result = text_service.to_title(payload.text)
    maybe_save_history(db, user, payload.text, result, 'title')
    return {'result': result}


@router.post('/spell', response_model=schemas.TransformResponse)
def spell(payload: schemas.TransformRequest, db: Session = Depends(get_db), user: models.User | None = Depends(get_optional_user)):
    result = text_service.spell_check(payload.text)
    maybe_save_history(db, user, payload.text, result, 'spell')
    return {'result': result}
