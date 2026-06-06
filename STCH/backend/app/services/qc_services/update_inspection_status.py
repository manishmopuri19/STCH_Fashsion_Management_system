from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.quality_inspection_model import QualityInspection
from app.schemas.qc_schema import UpdateInspectionStatusSchema

def update_inspection_status_service(

    inspection_id: int,

    payload: UpdateInspectionStatusSchema,

    db: Session
):

    inspection = db.query(
        QualityInspection
    ).filter(
        QualityInspection.id
        == inspection_id
    ).first()

    if not inspection:

        raise HTTPException(
            status_code=404,
            detail="Inspection not found"
        )

    inspection.status = payload.status

    inspection.result =payload.result
    

    db.commit()

    db.refresh(inspection)

    return {

        "message":
        "Inspection updated successfully"
    }