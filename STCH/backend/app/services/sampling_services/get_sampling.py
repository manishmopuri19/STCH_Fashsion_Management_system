from sqlalchemy.orm import Session
from app.models.sampling_model import SamplingRecord
from app.utils.rfq_permissions import can_access_rfq
from app.enums.product_dev_enums import SampleType


def get_sampling_service(rfq_id: int, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    records = db.query(SamplingRecord).filter(
        SamplingRecord.rfq_id == rfq_id
    ).all()

    # Return all sample types, filling NOT_STARTED for missing ones
    existing = {r.sample_type: r for r in records}
    result = []
    for sample_type in SampleType:
        if sample_type in existing:
            r = existing[sample_type]
            result.append({
                "id": r.id,
                "rfq_id": r.rfq_id,
                "sample_type": r.sample_type,
                "status": r.status,
                "comments": r.comments,
                "file_url": r.file_url,
                "submitted_date": r.submitted_date,
                "approved_date": r.approved_date,
                "created_at": r.created_at,
                "updated_at": r.updated_at,
            })
        else:
            result.append({
                "id": None,
                "rfq_id": rfq_id,
                "sample_type": sample_type,
                "status": "NOT_STARTED",
                "comments": None,
                "file_url": None,
                "submitted_date": None,
                "approved_date": None,
                "created_at": None,
                "updated_at": None,
            })
    return result
