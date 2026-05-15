from sqlalchemy.orm import Session

from app.models.rfqCollaborator_model import (
    RFQCollaborator
)

from app.models.user_model import User


def get_collaborators_service(
    rfq_id: int,
    db: Session
):

    collaborators = db.query(
        RFQCollaborator
    ).filter(
        RFQCollaborator.rfq_id
        == rfq_id
    ).all()

    response = []

    for item in collaborators:

        user = db.query(User).filter(
            User.id == item.user_id
        ).first()

        response.append({

            "id": user.id,

            "userName":
            user.userName,

            "email":
            user.email,

            "role":
            user.role.value
        })

    return response