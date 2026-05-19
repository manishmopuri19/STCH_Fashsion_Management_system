from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.user_model import User
from app.schemas.auth_schema import (
    UserLogin
)
from app.utils.passwordEncryption import (
    hash_password,
    verify_password
)
from app.core.auth import create_access_token
from app.models.supplier_model import Supplier

router = APIRouter()

# DATABASE DEPENDENCY
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# LOGIN USER
@router.post("/login")
def login(
    payload: UserLogin,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == payload.email.lower().strip()
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        payload.password,
        user.password
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email,
            "role": str(user.role),
        }
    )
    supplier = None

    if str(user.role) == "UserRole.SUPPLIER":

        supplier = db.query(Supplier).filter(
        Supplier.user_id == user.id
        ).first()
   
    return {

    "message": "Login successful",
    "access_token": access_token,
    "user": {

        "id": user.id,

        "userName":
        user.userName,

        "email":
        user.email,

        "role":
        str(user.role),

        "supplier_id":
        supplier.id if supplier else None
    }
}