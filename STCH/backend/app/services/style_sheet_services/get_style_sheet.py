from sqlalchemy.orm import Session
from app.models.style_sheet_model import StyleSheet
from app.utils.rfq_permissions import can_access_rfq


def get_style_sheet_service(rfq_id: int, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)
    record = db.query(StyleSheet).filter(StyleSheet.rfq_id == rfq_id).first()
    if not record:
        return {"rfq_id": rfq_id, "status": "NOT_STARTED"}
    return record
