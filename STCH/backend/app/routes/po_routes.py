from fastapi import APIRouter,Depends


from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.schemas.po_schema import ConvertRFQToPOSchema


from app.services.po_services.convert_rfq_to_po import convert_rfq_to_po_service


from app.core.permissions import require_roles


from app.enums.user_enums import UserRole


from app.services.po_services.get_all_pos import get_all_pos_service


from app.services.po_services.get_single_po import get_single_po_service
from app.services.po_services.get_po_by_rfq import get_po_by_rfq_service


from app.services.po_services.update_po_status import update_po_status_service


from app.services.po_services.update_po_commercials import update_po_commercials_service

from app.schemas.po_update_schema import UpdatePOCommercialSchema


from app.schemas.po_status_schema import UpdatePOStatusSchema


router = APIRouter(
    prefix="/purchase-orders",
    tags=["Purchase Orders"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post(
    "/convert-from-rfq/{rfq_id}"
)
def convert_rfq_to_po(

    rfq_id: int,

    payload: ConvertRFQToPOSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return convert_rfq_to_po_service(

        rfq_id,
        payload,
        db,
        current_user
    )

@router.get("/by-rfq/{rfq_id}")
def get_po_by_rfq(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER,
            UserRole.MEMBER,
        ])
    )
):
    return get_po_by_rfq_service(rfq_id, db, current_user)


@router.get("/")
def get_all_pos(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER,
            UserRole.MEMBER,
        ])
    )
):

    return get_all_pos_service(db, current_user)


@router.get("/{po_id}")
def get_single_po(

    po_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER,
            UserRole.MEMBER,
        ])
    )
):

    return get_single_po_service(
        po_id,
        db,
        current_user
    )


@router.patch("/{po_id}/status")
def update_po_status(

    po_id: int,

    payload: UpdatePOStatusSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return update_po_status_service(
        po_id,
        payload.status,
        db
    )


@router.patch("/{po_id}/commercials")
def update_po_commercials(

    po_id: int,

    payload: UpdatePOCommercialSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return update_po_commercials_service(
        po_id,
        payload,
        db
    )