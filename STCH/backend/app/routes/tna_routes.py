from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.schemas.tna_schema import (
    CreateTNASchema,
    UpdateTNASchema,
    UpdateTNAStatusSchema
)

from app.services.tna_services.get_po_tnas import (get_po_tnas_service)

from app.services.tna_services.create_tna import (create_tna_service)

from app.services.tna_services.update_tna import (update_tna_service)

from app.services.tna_services.update_tna_status import (update_tna_status_service)

from app.services.tna_services.get_delayed_tnas import (get_delayed_tnas_service)

from app.core.permissions import (require_roles)

from app.enums.user_enums import ( UserRole)

router = APIRouter(prefix="/tnas",tags=["TNA"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/po/{po_id}")
def get_po_tnas(

    po_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return get_po_tnas_service(
        po_id,
        db
    )


@router.post("/po/{po_id}")
def create_tna(

    po_id: int,

    payload: CreateTNASchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return create_tna_service(
        po_id,
        payload,
        db
    )


@router.patch("/{tna_id}")
def update_tna(

    tna_id: int,

    payload: UpdateTNASchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return update_tna_service(
        tna_id,
        payload,
        db
    )


@router.patch("/{tna_id}/status")
def update_tna_status(

    tna_id: int,

    payload: UpdateTNAStatusSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return update_tna_status_service(
        tna_id,
        payload.status,
        db
    )


@router.get("/delayed/all")
def get_delayed_tnas(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return get_delayed_tnas_service(
        db
    )