from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.rfq_model import RFQ


def get_single_rfq_service(
    rfq_id: int,
    db: Session
):

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:

        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    return rfq