from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.schemas.tna_schema import UpdateTNASchema

def update_tna_service(

    tna_id: int,

    payload:UpdateTNASchema,

    db: Session
):

    tna = db.query(TNA).filter(
        TNA.id == tna_id
    ).first()

    if not tna:

        raise HTTPException(
            status_code=404,
            detail="TNA not found"
        )

    tna.assigned_to = (
        payload.assigned_to
    )

    tna.priority = (
        payload.priority
    )

    tna.planned_date = (
        payload.planned_date
    )

    tna.actual_date = (
        payload.actual_date
    )

    tna.remarks = (
        payload.remarks
    )

    db.commit()

    db.refresh(tna)

    return {

        "message":
        "TNA updated successfully"
    }