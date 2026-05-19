from sqlalchemy.orm import Session

from app.models.rfq_supplier_model import (
    RFQSupplier
)

from app.models.supplier_model import (
    Supplier
)

from app.enums.user_enums import UserRole


def get_rfq_suppliers_service(

    rfq_id: int,

    db: Session,

    current_user
):

    query = db.query(RFQSupplier).filter(
        RFQSupplier.rfq_id == rfq_id
    )

    # SUPPLIER — only show their own record
    if current_user.role == UserRole.SUPPLIER:

        supplier_profile = db.query(Supplier).filter(
            Supplier.user_id == current_user.id
        ).first()

        if not supplier_profile:
            return []

        query = query.filter(
            RFQSupplier.supplier_id == supplier_profile.id
        )

    items = query.all()

    if not items:
        return []

    # Batch-fetch all related suppliers to avoid N+1 queries
    supplier_ids = [item.supplier_id for item in items]

    suppliers = {
        s.id: s
        for s in db.query(Supplier).filter(
            Supplier.id.in_(supplier_ids)
        ).all()
    }

    response = []

    for item in items:

        supplier = suppliers.get(item.supplier_id)

        if not supplier:
            continue

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
