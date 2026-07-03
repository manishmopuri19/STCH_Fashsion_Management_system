from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.po_style_model import POStyle
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.Tna_model import TNA
from app.enums.TNAStatus_enums import TNAActivityType, TNAStatus
from app.schemas.style_schema import POStyleCreate

from datetime import date, timedelta


# days before delivery_date for each step's default planned_date
DEFAULT_STYLE_TNA_SCHEDULE = [
    (TNAActivityType.FABRIC_BOOKING,     65),
    (TNAActivityType.CUTTING,            50),
    (TNAActivityType.STITCHING_STARTED,  40),
    (TNAActivityType.WASHING,            32),
    (TNAActivityType.DRYING,             26),
    (TNAActivityType.SAMPLE_TESTING,     20),
    (TNAActivityType.APPROVED,           14),
    (TNAActivityType.IRONING,             7),
    (TNAActivityType.PACKAGING,           3),
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
