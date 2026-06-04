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
from app.models.Tna_model import TNA
from app.models.rfqCollaborator_model import RFQCollaborator
from app.models.rfq_model import RFQ
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.po_style_model import POStyle

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
            UserRole.QUALITY_CONTROL
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
    return {
        "id": current_user.id,
        "userName": current_user.userName,
        "email": current_user.email,
        "role": current_user.role.value,
    }


@router.get("/qc-team")
def get_qc_team(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):
    users = (
        db.query(User)
        .filter(User.role == UserRole.QUALITY_CONTROL)
        .all()
    )

    result = []
    for u in users:
        tna_count = db.query(TNA).filter(TNA.assigned_to == u.id).count()
        rfq_count = (
            db.query(RFQCollaborator)
            .filter(RFQCollaborator.user_id == u.id)
            .count()
        )
        result.append({
            "id": u.id,
            "userName": u.userName,
            "email": u.email,
            "role": u.role.value,
            "tna_count": tna_count,
            "rfq_count": rfq_count,
        })

    return result


@router.get("/{user_id}/qc-detail")
def get_qc_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Assigned TNAs with PO and style context
    tnas_raw = (
        db.query(TNA)
        .filter(TNA.assigned_to == user_id)
        .all()
    )

    tna_list = []
    for t in tnas_raw:
        po = db.query(PurchaseOrder).filter(PurchaseOrder.id == t.po_id).first() if t.po_id else None
        style = db.query(POStyle).filter(POStyle.id == t.style_id).first() if t.style_id else None
        tna_list.append({
            "id": t.id,
            "activity_type": t.activity_type.value if t.activity_type else None,
            "status": t.status.value if t.status else None,
            "priority": t.priority.value if t.priority else None,
            "planned_date": str(t.planned_date) if t.planned_date else None,
            "actual_date": str(t.actual_date) if t.actual_date else None,
            "delayed_reason": t.delayed_reason,
            "remarks": t.remarks,
            "po_id": t.po_id,
            "po_number": po.po_number if po else None,
            "style_id": t.style_id,
            "style_name": style.style_name if style else None,
            "style_code": style.style_code if style else None,
        })

    # RFQs where user is a collaborator
    collab_rfq_ids = (
        db.query(RFQCollaborator.rfq_id)
        .filter(RFQCollaborator.user_id == user_id)
        .all()
    )
    rfq_id_list = [r[0] for r in collab_rfq_ids]

    rfqs_raw = (
        db.query(RFQ)
        .filter(RFQ.id.in_(rfq_id_list))
        .all()
    ) if rfq_id_list else []

    rfq_list = [
        {
            "id": r.id,
            "rfq_number": r.rfq_number,
            "brand": r.brand,
            "garment_type": r.garment_type,
            "status": r.status.value if r.status else None,
            "delivery_date": str(r.delivery_date) if r.delivery_date else None,
        }
        for r in rfqs_raw
    ]

    return {
        "user": {
            "id": user.id,
            "userName": user.userName,
            "email": user.email,
            "role": user.role.value,
        },
        "rfqs": rfq_list,
        "tnas": tna_list,
    }


@router.get("/{user_id}")
def get_single_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.MEMBER,
            UserRole.QUALITY_CONTROL,
            UserRole.SUPPLIER,
        ])
    )
):
    is_privileged = current_user.role in (UserRole.ADMIN, UserRole.MERCHANDISER)
    if not is_privileged and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

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