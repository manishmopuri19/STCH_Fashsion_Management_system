from sqlalchemy.orm import Session

from app.models.purchaseOrder_model import (
    PurchaseOrder
)

from app.models.supplier_model import (
    Supplier
)

from app.models.rfq_model import RFQ

from app.models.rfqCollaborator_model import (
    RFQCollaborator
)

from app.models.rfq_supplier_model import (
    RFQSupplier
)

from app.enums.user_enums import (
    UserRole
)


def get_all_pos_service(

    db: Session,

    current_user
):

    query = db.query(
        PurchaseOrder
    )

    # ADMIN
    if current_user.role == (
        UserRole.ADMIN
    ):

        pos = query.order_by(
            PurchaseOrder.created_at.desc()
        ).all()

    # MERCHANDISER
    elif current_user.role == (
        UserRole.MERCHANDISER
    ):

        collaborated_rfq_ids = db.query(
            RFQCollaborator.rfq_id
        ).filter(
            RFQCollaborator.user_id
            == current_user.id
        )

        pos = query.join(
            RFQ,
            RFQ.id == PurchaseOrder.rfq_id
        ).filter(

            (RFQ.created_by ==
             current_user.id)

            |

            (PurchaseOrder.rfq_id.in_(
                collaborated_rfq_ids
            ))

        ).order_by(
            PurchaseOrder.created_at.desc()
        ).all()

    # SUPPLIER
    elif current_user.role == (
        UserRole.SUPPLIER
    ):

        supplier_profile = db.query(Supplier).filter(
            Supplier.user_id == current_user.id
        ).first()

        if not supplier_profile:
            return []

        pos = query.filter(
            PurchaseOrder.supplier_id == supplier_profile.id
        ).order_by(
            PurchaseOrder.created_at.desc()
        ).all()

    else:

        collaborated_rfq_ids = db.query(
            RFQCollaborator.rfq_id
        ).filter(
            RFQCollaborator.user_id
            == current_user.id
        )

        pos = query.filter(

            PurchaseOrder.rfq_id.in_(
                collaborated_rfq_ids
            )

        ).order_by(
            PurchaseOrder.created_at.desc()
        ).all()

    if not pos:
        return []

    # Batch-fetch all related RFQs and suppliers to avoid N+1 queries
    rfq_ids = list({po.rfq_id for po in pos})
    supplier_ids = list({po.supplier_id for po in pos})

    rfqs = {
        r.id: r
        for r in db.query(RFQ).filter(RFQ.id.in_(rfq_ids)).all()
    }

    suppliers = {
        s.id: s
        for s in db.query(Supplier).filter(Supplier.id.in_(supplier_ids)).all()
    }

    response = []

    for po in pos:

        rfq = rfqs.get(po.rfq_id)
        supplier = suppliers.get(po.supplier_id)

        if not rfq or not supplier:
            continue

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

            "currency":
            po.currency,

            "target_price":
            po.target_price,

            "supplier_price":
            po.supplier_price,

            "total_amount":
            po.total_amount,

            "margin":
            po.margin,

            "profitability":
            po.profitability,

            "lead_time":
            po.lead_time,

            "status":
            po.status.value,

            "delivery_date":
            po.delivery_date,

            "created_at":
            po.created_at
        })

    return response
