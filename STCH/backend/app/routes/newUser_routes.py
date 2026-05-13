
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole
from app.models.user_model import User
from app.schemas.NewUser_schema import newUser
from app.utils.passwordEncryption import hash_password

router=APIRouter()

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.get("/allusers")
def get_all_users(
    db:Session=Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN]))
):
    
    users=db.query(User).all()

    return users

@router.post("/addNewUser")
def addNew_User(
    data_in:newUser,
    db:Session=Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN]))
):
    user_exists = db.query(User).filter(User.email == data_in.email).first()

    if user_exists:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    new_user_obj=User(
        userName=data_in.userName,
        email=data_in.email,
        password=hash_password(data_in.password),
        role=data_in.role
    )
    db.add(new_user_obj)
    db.commit()

    return {
        "message":"new user Created successfully","user":newUser
    }

@router.put("/deleteuser/{user_id}")
def deleteUser(
    user_id:int,
    db:Session=Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN]))
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()
