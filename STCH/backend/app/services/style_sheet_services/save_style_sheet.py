from sqlalchemy.orm import Session
from app.models.style_sheet_model import StyleSheet
from app.schemas.style_sheet_schema import StyleSheetSave
from app.utils.rfq_permissions import can_access_rfq
from app.enums.product_dev_enums import ProductDevStatus


def save_style_sheet_service(rfq_id: int, payload: StyleSheetSave, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    record = db.query(StyleSheet).filter(StyleSheet.rfq_id == rfq_id).first()
    if not record:
        record = StyleSheet(rfq_id=rfq_id)
        db.add(record)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(record, field, value)

    if record.status == ProductDevStatus.NOT_STARTED and any([
        record.fabric_details, record.fit_type, record.front_image_url
    ]):
        record.status = ProductDevStatus.IN_PROGRESS

    db.commit()
    db.refresh(record)
    return record
