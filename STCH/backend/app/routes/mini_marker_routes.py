from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.mini_marker_schema import MiniMarkerSave, MiniMarkerStatusUpdate
from app.services.mini_marker_services.get_mini_marker import get_mini_marker_service
from app.services.mini_marker_services.save_mini_marker import save_mini_marker_service
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(prefix="/rfqs/{rfq_id}/mini-marker", tags=["Mini Marker"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_mini_marker(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.SUPPLIER]))
):
    return get_mini_marker_service(rfq_id, db, current_user)


@router.put("/")
def save_mini_marker(
    rfq_id: int,
    payload: MiniMarkerSave,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return save_mini_marker_service(rfq_id, payload, db, current_user)
