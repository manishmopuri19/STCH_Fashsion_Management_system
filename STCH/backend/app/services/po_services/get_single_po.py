from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.purchaseOrder_model import (
    PurchaseOrder
)
from app.utils.po_permissions import (
    can_access_po
)
from app.models.rfq_model import RFQ

from app.models.supplier_model import (
    Supplier
)


def get_single_po_service(

    po_id: int,

    db: Session,
    current_user
):
    can_access_po(po_id,current_user,db)

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

    rfq = db.query(RFQ).filter(
        RFQ.id == po.rfq_id
    ).first()

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == po.supplier_id
    ).first()

    return {

        "id": po.id,

        "po_number":
        po.po_number,

        "status":
        po.status.value,

        "supplier": {

            "id": supplier.id,

            "company_name":
            supplier.company_name,

            "email":
            supplier.email
        },

        "rfq": {

            "id": rfq.id,

            "brand":
            rfq.brand,

            "garment_type":
            rfq.garment_type,

            "fabric_type":
            rfq.fabric_type
        },

        "commercials": {

            "target_price":
            po.target_price,

            "supplier_price":
            po.supplier_price,

            "margin":
            po.margin,

            "profitability":
            po.profitability,

            "total_amount":
            po.total_amount
        },

        "quantity":
        po.quantity,

        "currency":
        po.currency,

        "delivery_date":
        po.delivery_date,

        "lead_time":
        po.lead_time,

        "payment_terms":
        po.payment_terms,

        "created_at":
        po.created_at
    }