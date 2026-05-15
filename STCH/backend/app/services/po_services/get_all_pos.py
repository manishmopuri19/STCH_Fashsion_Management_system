from sqlalchemy.orm import Session

from app.models.purchaseOrder_model import PurchaseOrder

from app.models.supplier_model import (
    Supplier
)

from app.models.rfq_model import RFQ


def get_all_pos_service(
    db: Session
):

    pos = db.query(
        PurchaseOrder
    ).order_by(
        PurchaseOrder.created_at.desc()
    ).all()

    response = []

    for po in pos:

        supplier = db.query(
            Supplier
        ).filter(
            Supplier.id == po.supplier_id
        ).first()

        rfq = db.query(
            RFQ
        ).filter(
            RFQ.id == po.rfq_id
        ).first()

        response.append({

            "id": po.id,

            "po_number":
            po.po_number,

            "brand":
            rfq.brand,

            "garment_type":
            rfq.garment_type,

            "supplier":
            supplier.company_name,

            "quantity":
            po.quantity,

            "target_price":
            po.target_price,

            "supplier_price":
            po.supplier_price,

            "margin":
            po.margin,

            "profitability":
            po.profitability,

            "status":
            po.status.value,

            "delivery_date":
            po.delivery_date,

            "created_at":
            po.created_at
        })

    return response