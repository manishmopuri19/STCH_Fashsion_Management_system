from fastapi import HTTPException

from app.models.rfqCollaborator_model import (
    RFQCollaborator
)
from sqlalchemy.orm import Session


def add_collaborator_service(

    rfq_id: int,

    user_id: int,

    db:Session
):

    existing = db.query(
        RFQCollaborator
    ).filter(

        RFQCollaborator.rfq_id
        == rfq_id,

        RFQCollaborator.user_id
        == user_id

    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Collaborator already exists"
        )

    collaborator = RFQCollaborator(

        rfq_id=rfq_id,

        user_id=user_id
    )

    db.add(collaborator)

    db.commit()

    db.refresh(collaborator)

    return {
        "message":
        "Collaborator added successfully"
    }