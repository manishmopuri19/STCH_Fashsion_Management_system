from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.models.Tna_model import TNA
from app.models.po_style_model import POStyle
from app.models.purchaseOrder_model import PurchaseOrder
from app.enums.TNAStatus_enums import TNAActivityType, TNAStatus, TNA_WORKFLOW_ORDER

_DEFAULT_DAYS_BEFORE = {
    TNAActivityType.FABRIC_BOOKING:    65,
    TNAActivityType.CUTTING:           50,
    TNAActivityType.STITCHING_STARTED: 40,
    TNAActivityType.WASHING:           32,
    TNAActivityType.DRYING:            26,
    TNAActivityType.SAMPLE_TESTING:    20,
    TNAActivityType.APPROVED:          14,
    TNAActivityType.IRONING:            7,
    TNAActivityType.PACKAGING:          3,
}


def reset_style_tnas_service(style_id: int, db: Session):
    style = db.query(POStyle).filter(POStyle.id == style_id).first()
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")

    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == style.po_id).first()
    base_date = po.delivery_date if (po and po.delivery_date) else date.today() + timedelta(days=90)

    # Delete existing workflow TNAs for this style
    db.query(TNA).filter(
        TNA.style_id == style_id,
        TNA.activity_type.in_([a.value for a in TNA_WORKFLOW_ORDER]),
    ).delete(synchronize_session=False)

    # Recreate all 9 steps
    for activity in TNA_WORKFLOW_ORDER:
        days = _DEFAULT_DAYS_BEFORE.get(activity, 0)
        planned = base_date - timedelta(days=days)
        db.add(TNA(
            po_id=style.po_id,
            style_id=style_id,
            activity_type=activity,
            planned_date=planned,
            status=TNAStatus.PENDING,
        ))

    db.commit()
    return {"message": "TNA milestones reset to 9-step workflow"}
