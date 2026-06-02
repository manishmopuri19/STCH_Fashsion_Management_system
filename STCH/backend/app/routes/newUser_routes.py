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
from app.services.user_services import addNewUser

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
def newUser(

    data_in: NewUser,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    return (addNewUser.create_user_service(data_in,
        db))
# UPDATE USER
@router.patch("/{user_id}")

def update_user(

    user_id: int,

    data_in: UpdateUser,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MEMBER,
            UserRole.SUPPLIER,
            UserRole.MERCHANDISER,
            UserRole.QC,
        ])
    )
):

    # Non-admins can only update their own profile
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # UPDATE ONLY PROVIDED FIELDS
    if data_in.userName is not None:

        user.userName = data_in.userName


    if data_in.email is not None:

        user.email = data_in.email


    # ONLY ADMIN CAN CHANGE ROLE
    if (
        data_in.role is not None
        and
        current_user.role == UserRole.ADMIN
    ):

        user.role = data_in.role


    # PASSWORD UPDATE
    if (
        data_in.password
        and
        data_in.password.strip() != ""
    ):

        if len(data_in.password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters"
            )

        user.password = hash_password(
            data_in.password
        )


    db.commit()

    db.refresh(user)


    return {

        "message":
        "User updated successfully",

        "user": {

            "id": user.id,

            "userName":
            user.userName,

            "email":
            user.email,

            "role":
            user.role.value
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

@router.get("/me")
def get_my_profile(
    current_user=Depends(get_current_user)
):
    return current_user



@router.get("/{user_id}")
def get_single_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        get_current_user
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

    return {

        "id": user.id,

        "userName":
        user.userName,

        "email":
        user.email,

        "role":
        user.role.value
    }