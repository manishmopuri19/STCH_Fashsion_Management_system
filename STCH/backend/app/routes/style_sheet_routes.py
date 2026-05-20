from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.style_sheet_schema import StyleSheetSave
from app.services.style_sheet_services.get_style_sheet import get_style_sheet_service
from app.services.style_sheet_services.save_style_sheet import save_style_sheet_service
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(prefix="/rfqs/{rfq_id}/style-sheet", tags=["Style Sheet"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_style_sheet(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.SUPPLIER]))
):
    return get_style_sheet_service(rfq_id, db, current_user)


@router.put("/")
def save_style_sheet(
    rfq_id: int,
    payload: StyleSheetSave,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return save_style_sheet_service(rfq_id, payload, db, current_user)
