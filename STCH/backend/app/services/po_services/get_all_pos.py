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