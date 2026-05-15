from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.schemas.qc_schema import (
    CreateInspectionSchema,
    UpdateInspectionStatusSchema,
    CreateDefectSchema
)

from app.services.qc_services.create_inspection import (
    create_inspection_service
)

from app.services.qc_services.get_po_inspections import get_po_inspections_service

from app.services.qc_services.update_inspection_status import (
    update_inspection_status_service
)

from app.services.qc_services.add_defect import (
    add_defect_service
)

from app.services.qc_services.get_defects import (
    get_defects_service
)

from app.core.permissions import (
    require_roles
)

from app.enums.user_enums import (
    UserRole
)

router = APIRouter(
    prefix="/qc",
    tags=["Quality Control"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/po/{po_id}")
def create_inspection(

    po_id: int,

    payload: CreateInspectionSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return create_inspection_service(

        po_id,

        payload,

        db,

        current_user
    )


@router.get("/po/{po_id}")
def get_po_inspections(

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

    return get_po_inspections_service(
        po_id,
        db
    )


@router.patch("/{inspection_id}")
def update_inspection_status(

    inspection_id: int,

    payload:
    UpdateInspectionStatusSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return update_inspection_status_service(

        inspection_id,

        payload,

        db
    )


@router.post(
    "/{inspection_id}/defects"
)
def add_defect(

    inspection_id: int,

    payload: CreateDefectSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return add_defect_service(

        inspection_id,

        payload,

        db
    )


@router.get(
    "/{inspection_id}/defects"
)
def get_defects(

    inspection_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return get_defects_service(
        inspection_id,
        db
    )