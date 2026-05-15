from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user_model import User


def get_single_user_service(
    user_id: int,
    db: Session
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {

        "id": user.id,
        "userName": user.userName,
        "email": user.email,
        "role": user.role.value
    }