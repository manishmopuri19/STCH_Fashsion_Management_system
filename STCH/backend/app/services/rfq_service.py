from sqlalchemy.orm import Session

from app.models.rfq_model import RFQ


def get_all_rfqs(
    db: Session
):

    return db.query(RFQ).order_by(
        RFQ.id.desc()
    ).all()


def get_rfq_by_id(
    rfq_id: int,
    db: Session
):

    return db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()