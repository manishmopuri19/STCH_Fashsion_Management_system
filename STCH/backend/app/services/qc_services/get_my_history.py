from sqlalchemy.orm import Session

from app.models.quality_inspection_model import QualityInspection
from app.enums.qc_enums import QCStatus
from app.services.qc_services.get_my_work import _batch_format_inspections


def get_my_history_service(current_user, db: Session) -> list:
    inspections = (
        db.query(QualityInspection)
        .filter(
            QualityInspection.assigned_to == current_user.id,
            QualityInspection.status == QCStatus.COMPLETED,
        )
        .order_by(QualityInspection.created_at.desc())
        .all()
    )
    return _batch_format_inspections(inspections, db)
