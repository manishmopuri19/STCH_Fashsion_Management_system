from fastapi import HTTPException

from app.models.purchaseOrder_model import (
    PurchaseOrder
)

from app.utils.rfq_permissions import (
    can_access_rfq
)
from sqlalchemy.orm import Session


def can_access_po(

    po_id,

    current_user,

    db:Session
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

    # PO inherits RFQ access
    can_access_rfq(
        po.rfq_id,
        current_user,
        db
    )

    return True