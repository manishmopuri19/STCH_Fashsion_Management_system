from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.schemas.catalogue_schema import (
    CreateCatalogueSchema,
    UpdateCatalogueSchema
)

from app.services.catalogue_services.create_catalogue import (
    create_catalogue_service
)

from app.services.catalogue_services.get_all_catalogues import (
    get_all_catalogues_service
)

from app.services.catalogue_services.get_single_catalogue import (
    get_single_catalogue_service
)

from app.services.catalogue_services.update_catalogue import (
    update_catalogue_service
)

from app.services.catalogue_services.delete_catalogue import (
    delete_catalogue_service
)
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(
    prefix="/catalogues",
    tags=["Catalogues"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/")
def create_catalogue(
    payload: CreateCatalogueSchema,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):

    return create_catalogue_service(
        payload,
        db
    )


@router.get("/")
def get_all_catalogues(
    db: Session = Depends(get_db)
):
    return get_all_catalogues_service(db)


@router.get("/{catalogue_id}")
def get_single_catalogue(
    catalogue_id: int,
    db: Session = Depends(get_db)
):
    return get_single_catalogue_service(
        catalogue_id,
        db
    )


@router.patch("/{catalogue_id}")
def update_catalogue(

    catalogue_id: int,

    payload: UpdateCatalogueSchema,

    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):

    return update_catalogue_service(
        catalogue_id,
        payload,
        db
    )


@router.delete("/{catalogue_id}")
def delete_catalogue(

    catalogue_id: int,

    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):

    return delete_catalogue_service(
        catalogue_id,
        db
    )
