from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.core.permissions import (
    require_roles
)

from app.enums.user_enums import (
    UserRole
)

from app.models.user_model import User

from app.schemas.NewUser_schema import (
    NewUser,
    UpdateUser
)

from app.utils.passwordEncryption import (
    hash_password
)

from app.services.user_services.get_all_users import (
    getAllUsers
)
from app.core.security import get_current_user
from app.models.supplier_model import Supplier

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# DATABASE SESSION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# GET ALL USERS
@router.get("/")
def get_all_users(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    users = getAllUsers(db)

    return users


# CREATE USER
@router.post("/")
def create_user(

    data_in: NewUser,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    user_exists = db.query(User).filter(
        User.email == data_in.email
    ).first()

    if user_exists:

        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    new_user_obj = User(

        userName=data_in.userName,

        email=data_in.email,

        password=hash_password(
            data_in.password
        ),

        role=data_in.role
    )

    db.add(new_user_obj)

    db.commit()

    db.refresh(new_user_obj)

    return {

        "message": "New user created successfully",

        "user": {

            "id": new_user_obj.id,

            "userName": new_user_obj.userName,

            "email": new_user_obj.email,

            "role": new_user_obj.role.value
        }
    }


# UPDATE USER
@router.patch("/{user_id}")
def update_user(

    user_id: int,

    data_in: UpdateUser,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.userName = data_in.userName

    user.email = data_in.email

    user.role = data_in.role

    if data_in.password:

        user.password = hash_password(
            data_in.password
        )

    db.commit()

    db.refresh(user)

    return {

        "message": "User updated successfully",

        "user": {

            "id": user.id,

            "userName": user.userName,

            "email": user.email,

            "role": user.role.value
        }
    }


# DELETE USER
@router.delete("/{user_id}")
def delete_user(user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ]))):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)

    db.commit()

    return {

        "message": "User deleted successfully"
    }

@router.get("user/me")
def get_my_profile(
    current_user=Depends(get_current_user)
):
    print(current_user)
    return current_user
