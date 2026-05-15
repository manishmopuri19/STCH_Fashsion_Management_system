from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user_model import User

from app.schemas.NewUser_schema import newUser

from app.utils.passwordEncryption import hash_password


def create_user_service(
    payload: newUser,
    db: Session
):

    existing_user = db.query(User).filter(
        User.email == payload.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(

        userName=payload.userName,

        email=payload.email,

        password=hash_password(
            payload.password
        ),

        role=payload.role
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message": "User created successfully",

        "user": {
            "id": new_user.id,
            "userName": new_user.userName,
            "email": new_user.email,
            "role": new_user.role.value
        }
    }