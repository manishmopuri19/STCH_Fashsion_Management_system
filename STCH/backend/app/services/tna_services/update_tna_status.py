from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.schemas.tna_schema import UpdateTNAStatusSchema

def update_tna_status_service(

    tna_id: int,

    status:UpdateTNAStatusSchema,

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

    tna.status = status

    db.commit()

    db.refresh(tna)

    return {

        "message":
        "TNA status updated"
    }
