from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.rfq_model import RFQ

from app.utils.rfq_permissions import (
    can_access_rfq
)


def get_single_rfq_service(

    rfq_id: int,

    db: Session,

    current_user
):

    can_access_rfq(
        rfq_id,
        current_user,
        db
    )

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:

        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    return rfq