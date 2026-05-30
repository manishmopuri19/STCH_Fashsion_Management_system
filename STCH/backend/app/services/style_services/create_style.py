from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.po_style_model import POStyle
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.Tna_model import TNA
from app.enums.TNAStatus_enums import TNAActivityType, TNAStatus
from app.schemas.style_schema import POStyleCreate

from datetime import date, timedelta


DEFAULT_STYLE_TNA_SCHEDULE = [
    (TNAActivityType.FABRIC_BOOKING, 60),
    (TNAActivityType.LAB_DIP_APPROVAL, 55),
    (TNAActivityType.TRIMS_APPROVAL, 50),
    (TNAActivityType.PP_SAMPLE, 45),
    (TNAActivityType.SIZE_SET_SAMPLE, 40),
    (TNAActivityType.CUTTING_START, 30),
    (TNAActivityType.STITCHING_START, 25),
    (TNAActivityType.INLINE_INSPECTION, 20),
    (TNAActivityType.FINISHING, 15),
    (TNAActivityType.FINAL_INSPECTION, 10),
    (TNAActivityType.PACKING, 7),
    (TNAActivityType.DISPATCH, 0),
]


def generate_style_code(po_id: int, db: Session) -> str:
    count = db.query(POStyle).filter(POStyle.po_id == po_id).count()
    return f"PO{po_id}-STY-{count + 1:03d}"


def create_style_service(po_id: int, payload: POStyleCreate, db: Session):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    style_code = generate_style_code(po_id, db)

    style = POStyle(
        po_id=po_id,
        style_name=payload.style_name,
        style_code=style_code,
        description=payload.description,
    )
    db.add(style)
    db.flush()

    base_date = po.delivery_date if po.delivery_date else date.today() + timedelta(days=90)

    for activity, days_before in DEFAULT_STYLE_TNA_SCHEDULE:
        planned = base_date - timedelta(days=days_before)
        tna = TNA(
            po_id=po_id,
            style_id=style.id,
            activity_type=activity,
            planned_date=planned,
            status=TNAStatus.PENDING,
        )
        db.add(tna)

    db.commit()
    db.refresh(style)

    return {
        "id": style.id,
        "style_name": style.style_name,
        "style_code": style.style_code,
        "description": style.description,
        "message": "Style created with default TNA milestones",
    }
