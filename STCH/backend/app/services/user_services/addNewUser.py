from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.user_model import User
from app.models.supplier_model import Supplier

from app.schemas.NewUser_schema import NewUser

from app.utils.passwordEncryption import (
    hash_password
)

from app.enums.user_enums import (
    UserRole
)


def create_user_service(

    payload: NewUser,

    db: Session
):

    normalized_email = payload.email.lower().strip()

    if len(payload.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )

    existing_user = db.query(
        User
    ).filter(
        User.email == normalized_email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )


    # CREATE USER
    new_user = User(

        userName=payload.userName,

        email=normalized_email,

        password=hash_password(
            payload.password
        ),

        role=payload.role
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    # AUTO CREATE SUPPLIER PROFILE
    if new_user.role == UserRole.SUPPLIER:

        supplier = Supplier(

            user_id=new_user.id,

            company_name=
            payload.userName,

            contact_person=
            payload.userName,

            email=
            payload.email
        )

        db.add(supplier)

        db.commit()

        db.refresh(supplier)


    return {

        "message":
        "User created successfully",

        "user_details": {

            "id": new_user.id,

            "userName":
            new_user.userName,

            "email":
            new_user.email,

            "role":
            new_user.role.value
        }
    }