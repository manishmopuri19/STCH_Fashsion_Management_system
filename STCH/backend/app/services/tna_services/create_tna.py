from fastapi import HTTPException
from app.models.Tna_model import TNA
from app.models.purchaseOrder_model import PurchaseOrder
from sqlalchemy.orm import Session
from app.enums.TNAStatus_enums import TNAStatus
from app.schemas.tna_schema import CreateTNASchema


def create_tna_service(po_id: int, payload: CreateTNASchema, db: Session):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    if payload.planned_date and po.delivery_date and payload.planned_date > po.delivery_date:
        raise HTTPException(
            status_code=400,
            detail=f"Planned date cannot be after the delivery date ({po.delivery_date}).",
        )

    tna = TNA(
        po_id=po_id,
        style_id=payload.style_id,
        activity_type=payload.activity_type,
        assigned_to=payload.assigned_to,
        priority=payload.priority,
        planned_date=payload.planned_date,
        remarks=payload.remarks,
        status=TNAStatus.PENDING,
    )

    db.add(tna)
    db.commit()
    db.refresh(tna)

    return {"message": "TNA created successfully"}