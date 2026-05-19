from fastapi import HTTPException

from app.models.rfqCollaborator_model import (
    RFQCollaborator
)
from sqlalchemy.orm import Session
from app.models.rfq_model import RFQ

def remove_collaborator_service(

    rfq_id: int,

    user_id: int,

    db:Session
):

    collaborator = db.query(
        RFQCollaborator
    ).filter(

        RFQCollaborator.rfq_id
        == rfq_id,

        RFQCollaborator.user_id
        == user_id

    ).first()

    if not collaborator:

        raise HTTPException(
            status_code=404,
            detail="Collaborator not found"
        )
    
    rfq = db.query(RFQ).filter(
    RFQ.id == rfq_id
    ).first()

    if rfq.created_by == user_id:

        raise HTTPException(
        status_code=400,
        detail="RFQ creator cannot be removed"
        )

    db.delete(collaborator)

    db.commit()

    return {

        "message":
        "Collaborator removed successfully"
    }