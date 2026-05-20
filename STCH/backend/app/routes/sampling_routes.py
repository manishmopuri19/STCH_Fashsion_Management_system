from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.sampling_schema import SamplingRecordSave, SamplingStatusUpdate
from app.services.sampling_services.get_sampling import get_sampling_service
from app.services.sampling_services.save_sampling import save_sampling_service, update_sampling_status_service
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(prefix="/rfqs/{rfq_id}/sampling", tags=["Sampling"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_sampling(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.SUPPLIER]))
):
    return get_sampling_service(rfq_id, db, current_user)


@router.put("/")
def save_sampling(
    rfq_id: int,
    payload: SamplingRecordSave,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return save_sampling_service(rfq_id, payload, db, current_user)


@router.patch("/records/{record_id}/status")
def update_sampling_status(
    rfq_id: int,
    record_id: int,
    payload: SamplingStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    return update_sampling_status_service(record_id, payload, db, current_user)
