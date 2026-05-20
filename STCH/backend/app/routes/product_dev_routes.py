from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.product_dev_services.get_readiness import get_readiness_service
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(prefix="/rfqs/{rfq_id}/readiness", tags=["Product Development"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_readiness(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.SUPPLIER]))
):
    return get_readiness_service(rfq_id, db, current_user)
