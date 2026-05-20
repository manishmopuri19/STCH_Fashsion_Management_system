from sqlalchemy.orm import Session
from app.models.mini_marker_model import MiniMarker
from app.utils.rfq_permissions import can_access_rfq


def get_mini_marker_service(rfq_id: int, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)
    record = db.query(MiniMarker).filter(MiniMarker.rfq_id == rfq_id).first()
    if not record:
        return {"rfq_id": rfq_id, "status": "NOT_STARTED"}
    return record
