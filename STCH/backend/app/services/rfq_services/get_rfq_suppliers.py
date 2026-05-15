from sqlalchemy.orm import Session

from app.models.rfq_supplier_model import (
    RFQSupplier
)

from app.models.supplier_model import (
    Supplier
)


def get_rfq_suppliers_service(

    rfq_id: int,

    db: Session
):

    suppliers = db.query(
        RFQSupplier
    ).filter(
        RFQSupplier.rfq_id == rfq_id
    ).all()

    response = []

    for item in suppliers:

        supplier = db.query(
            Supplier
        ).filter(
            Supplier.id == item.supplier_id
        ).first()

        response.append({

            "id": item.id,

            "supplier_id":
            supplier.id,

            "supplier_name":
            supplier.company_name,

            "quoted_price":
            item.quoted_price,

            "target_price":
            item.supplier_target_price,

            "moq":
            item.moq,

            "lead_time":
            item.lead_time,

            "payment_terms":
            item.payment_terms,

            "status":
            item.status.value
        })

    return response