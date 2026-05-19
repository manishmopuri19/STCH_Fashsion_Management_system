from sqlalchemy.orm import Session

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


def get_all_rfqs_service(

    db: Session,

    current_user
):

    query = db.query(RFQ)

    # ADMIN → everything
    if current_user.role == UserRole.ADMIN:

        rfqs = query.order_by(
            RFQ.created_at.desc()
        ).all()

    # MERCHANDISER
    elif current_user.role == (
        UserRole.MERCHANDISER
    ):

        collaborated_ids = db.query(
            RFQCollaborator.rfq_id
        ).filter(
            RFQCollaborator.user_id
            == current_user.id
        )

        rfqs = query.filter(

            (RFQ.created_by ==
             current_user.id)

        | (

            RFQ.id.in_(
                collaborated_ids
            )

        )

        ).order_by(
            RFQ.created_at.desc()
        ).all()

    # SUPPLIER
    elif current_user.role == (UserRole.SUPPLIER):

      collaborated_ids = db.query(
            RFQCollaborator.rfq_id
        ).filter(
            RFQCollaborator.user_id
            == current_user.id
        )

      rfqs = query.filter(

            (RFQ.created_by ==
             current_user.id)

        | (

            RFQ.id.in_(
                collaborated_ids
            )

        )

        ).order_by(
            RFQ.created_at.desc()
        ).all()
    # OTHER USERS
    else:

        collaborated_ids = db.query(
            RFQCollaborator.rfq_id
        ).filter(
            RFQCollaborator.user_id
            == current_user.id
        )

        rfqs = query.filter(

            RFQ.id.in_(
                collaborated_ids
            )

        ).order_by(
            RFQ.created_at.desc()
        ).all()

    response = []

    for rfq in rfqs:

        response.append({

            "id":
            rfq.id,

            "rfq_number":
            rfq.rfq_number,

            "brand":
            rfq.brand,

            "garment_type":
            rfq.garment_type,

            "quantity":
            rfq.quantity,

            "target_price":
            rfq.target_price,

            "status":
            rfq.status.value,

            "priority":
            rfq.priority.value,

            "created_at":
            rfq.created_at,

            "delivery_date":
            rfq.delivery_date
        })

    return response