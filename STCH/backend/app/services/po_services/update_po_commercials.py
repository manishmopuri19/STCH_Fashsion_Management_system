from fastapi import HTTPException

from sqlalchemy.orm import Session
from app.schemas.po_update_schema import UpdatePOCommercialSchema

from app.models.purchaseOrder_model import (
    PurchaseOrder
)


def update_po_commercials_service(

    po_id: int,

    payload:UpdatePOCommercialSchema,

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

    po.supplier_price = (
        payload.supplier_price
    )

    po.lead_time = (
        payload.lead_time
    )

    po.payment_terms = (
        payload.payment_terms
    )

    # RECALCULATE
    po.margin = (
        po.target_price -
        po.supplier_price
    )

    po.profitability = (

        (po.margin / po.target_price)
        * 100

    )

    po.total_amount = (

        po.supplier_price *
        po.quantity

    )

    db.commit()

    db.refresh(po)

    return {

        "message":
        "PO commercials updated"
    }