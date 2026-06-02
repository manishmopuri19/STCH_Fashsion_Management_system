from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.models.po_style_model import POStyle
from app.enums.TNAStatus_enums import TNAStatus, TNAActivityType
from app.schemas.tna_schema import CreateStyleTNASchema


def create_style_tna_service(style_id: int, payload: CreateStyleTNASchema, db: Session):
    style = db.query(POStyle).filter(POStyle.id == style_id).first()
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")

    tna = TNA(
        style_id=style_id,
        po_id=style.po_id,
        activity_type=TNAActivityType.CUSTOM,
        custom_name=payload.custom_name.strip(),
        assigned_to=payload.assigned_to,
        priority=payload.priority,
        planned_date=payload.planned_date,
        remarks=payload.remarks,
        status=TNAStatus.PENDING,
    )

    db.add(tna)
    db.commit()
    db.refresh(tna)
    return {"message": "Custom TNA created", "id": tna.id}
