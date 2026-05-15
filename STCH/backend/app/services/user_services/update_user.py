from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user_model import User

from app.schemas.NewUser_schema import newUser

from app.utils.passwordEncryption import hash_password


def update_user_service(
    user_id: int,
    payload: newUser,
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

    user.userName = payload.userName

    user.email = payload.email

    user.role = payload.role

    if payload.password:

        user.password = hash_password(
            payload.password
        )

    db.commit()

    db.refresh(user)

    return {

        "message": "User updated successfully"
    }