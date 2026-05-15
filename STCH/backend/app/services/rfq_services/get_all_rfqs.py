from sqlalchemy.orm import Session

from app.models.rfq_model import RFQ


def get_all_rfqs_service(
    db: Session
):

    rfqs = db.query(RFQ).order_by(
        RFQ.created_at.desc()
    ).all()

    response = []

    for rfq in rfqs:

        response.append({

            "id": rfq.id,

            "rfq_number": rfq.rfq_number,

            "brand": rfq.brand,

            "garment_type": rfq.garment_type,

            "quantity": rfq.quantity,

            "target_price": rfq.target_price,

            "status": rfq.status.value,

            "priority": rfq.priority.value,

            "created_at": rfq.created_at
        })

    return response