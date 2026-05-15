from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.purchaseOrder_model import (
    PurchaseOrder
)
from app.schemas.po_status_schema import UpdatePOStatusSchema

def update_po_status_service(

    po_id: int,

    status:UpdatePOStatusSchema,

    db: Session
):

    po = db.query(
        PurchaseOrder
    ).filter(
        PurchaseOrder.id == po_id
    ).first()

    if not po:

        raise HTTPException(
            status_code=404,
            detail="PO not found"
        )

    po.status = status

    db.commit()

    db.refresh(po)

    return {

        "message":
        "PO status updated",

        "status":
        po.status.value
    }