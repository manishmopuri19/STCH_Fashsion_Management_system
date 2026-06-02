from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.enums.TNAStatus_enums import TNAActivityType


def delete_tna_service(tna_id: int, db: Session):
    tna = db.query(TNA).filter(TNA.id == tna_id).first()
    if not tna:
        raise HTTPException(status_code=404, detail="TNA not found")

    if tna.activity_type != TNAActivityType.CUSTOM:
        raise HTTPException(
            status_code=400,
            detail="Only custom TNA milestones can be deleted"
        )

    db.delete(tna)
    db.commit()
    return {"message": "TNA deleted"}
