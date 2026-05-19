from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.rfq_schema import (RFQCreate,RFQStatusUpdate)
from app.services.rfq_services.create_rfq import (create_rfq_service)
from app.services.rfq_services.get_all_rfqs import (get_all_rfqs_service)
from app.services.rfq_services.get_single_rfq import (get_single_rfq_service)
from app.services.rfq_services.update_rfq_status import (update_rfq_status_service)
from app.services.rfq_services.delete_rfq import (delete_rfq_service)
from app.core.permissions import (require_roles)

from app.enums.user_enums import (
    UserRole
)

router = APIRouter(
    prefix="/rfqs",
    tags=["RFQs"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/")
def get_all_rfqs(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return get_all_rfqs_service(db,current_user)


@router.get("/{rfq_id}")
def get_single_rfq(

    rfq_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return get_single_rfq_service(
    rfq_id,
    db,
    current_user
    )


@router.post("/")
def create_rfq(

    payload: RFQCreate,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return create_rfq_service(
        payload,
        db,
        current_user
    )


@router.patch("/{rfq_id}/status")
def update_rfq_status(

    rfq_id: int,

    payload: RFQStatusUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ]),
        
    )
):

    return update_rfq_status_service(
    rfq_id,
    payload.status,
    db,
    current_user
    )


@router.delete("/{rfq_id}")
def delete_rfq(

    rfq_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    return delete_rfq_service(
        rfq_id,
        db,
          current_user
    )