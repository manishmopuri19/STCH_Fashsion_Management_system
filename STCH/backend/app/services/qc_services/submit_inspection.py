from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.quality_inspection_model import QualityInspection
from app.schemas.qc_schema import SubmitInspectionSchema
from app.enums.qc_enums import QCStatus
from app.enums.user_enums import UserRole


def submit_inspection_service(
    inspection_id: int,
    payload: SubmitInspectionSchema,
    current_user,
    db: Session,
) -> dict:
    inspection = (
        db.query(QualityInspection)
        .filter(QualityInspection.id == inspection_id)
        .first()
    )

    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")

    if (
        current_user.role == UserRole.QUALITY_CONTROL
        and inspection.assigned_to != current_user.id
    ):
        raise HTTPException(status_code=403, detail="Not assigned to this inspection")

    inspection.inspection_date = payload.inspection_date
    inspection.aql_level = payload.aql_level
    inspection.total_checked = payload.total_checked
    inspection.passed_quantity = payload.passed_quantity
    inspection.failed_quantity = payload.failed_quantity
    inspection.result = payload.result
    inspection.remarks = payload.remarks
    inspection.status = QCStatus.COMPLETED
    inspection.inspected_by = current_user.id

    db.commit()
    db.refresh(inspection)

    return {"message": "Inspection submitted successfully", "inspection_id": inspection.id}
