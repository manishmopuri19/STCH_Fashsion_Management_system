from fastapi import HTTPException

from app.models.rfqCollaborator_model import (
    RFQCollaborator
)
from sqlalchemy.orm import Session

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

    db.delete(collaborator)

    db.commit()

    return {

        "message":
        "Collaborator removed successfully"
    }