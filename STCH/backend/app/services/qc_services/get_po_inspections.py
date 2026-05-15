from sqlalchemy.orm import Session

from app.models.quality_inspection_model import QualityInspection


def get_po_inspections_service(

    po_id: int,

    db: Session
):

    inspections = db.query(
        QualityInspection
    ).filter(
        QualityInspection.po_id == po_id
    ).all()

    return inspections