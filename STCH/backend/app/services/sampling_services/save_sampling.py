from sqlalchemy.orm import Session
from app.models.sampling_model import SamplingRecord
from app.schemas.sampling_schema import SamplingRecordSave, SamplingStatusUpdate
from app.utils.rfq_permissions import can_access_rfq
from fastapi import HTTPException


def save_sampling_service(rfq_id: int, payload: SamplingRecordSave, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    record = db.query(SamplingRecord).filter(
        SamplingRecord.rfq_id == rfq_id,
        SamplingRecord.sample_type == payload.sample_type
    ).first()

    if not record:
        record = SamplingRecord(rfq_id=rfq_id, sample_type=payload.sample_type)
        db.add(record)

    data = payload.model_dump(exclude_none=True)
    data.pop("sample_type", None)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


def update_sampling_status_service(record_id: int, payload: SamplingStatusUpdate, db: Session, current_user):
    record = db.query(SamplingRecord).filter(SamplingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sampling record not found")

    can_access_rfq(record.rfq_id, current_user, db)
    record.status = payload.status
    db.commit()
    db.refresh(record)
    return record
