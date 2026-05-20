from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.bom_schema import BOMSave, BOMItemCreate, BOMItemUpdate, BOMStatusUpdate
from app.services.bom_services.get_bom import get_bom_service
from app.services.bom_services.save_bom import (
    save_bom_service, add_bom_item_service, update_bom_item_service, delete_bom_item_service
)
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(prefix="/rfqs/{rfq_id}/bom", tags=["BOM"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_bom(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.SUPPLIER]))
):
    return get_bom_service(rfq_id, db, current_user)


@router.put("/")
def save_bom(
    rfq_id: int,
    payload: BOMSave,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return save_bom_service(rfq_id, payload, db, current_user)


@router.post("/items")
def add_bom_item(
    rfq_id: int,
    payload: BOMItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return add_bom_item_service(rfq_id, payload, db, current_user)


@router.patch("/items/{item_id}")
def update_bom_item(
    rfq_id: int,
    item_id: int,
    payload: BOMItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return update_bom_item_service(item_id, payload, db, current_user)


@router.delete("/items/{item_id}")
def delete_bom_item(
    rfq_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return delete_bom_item_service(item_id, db, current_user)
