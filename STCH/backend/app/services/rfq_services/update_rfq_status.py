from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.rfq_model import RFQ


def update_rfq_status_service(
    rfq_id: int,
    status,
    db: Session,
    current_user=None
):

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:

        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    rfq.status = status

    db.commit()

    db.refresh(rfq)

    return {
        "message": "RFQ status updated",
        "status": rfq.status.value
    }