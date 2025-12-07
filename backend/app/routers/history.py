from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix='/history', tags=['history'])


@router.get('/', response_model=list[schemas.HistoryItem])
def list_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.History).filter(models.History.user_id == current_user.id).order_by(models.History.timestamp.desc()).all()


@router.delete('/{history_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_item(history_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    item = db.query(models.History).filter(models.History.id == history_id, models.History.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='History item not found')
    db.delete(item)
    db.commit()


@router.delete('/', status_code=status.HTTP_204_NO_CONTENT)
def clear_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db.query(models.History).filter(models.History.user_id == current_user.id).delete()
    db.commit()
