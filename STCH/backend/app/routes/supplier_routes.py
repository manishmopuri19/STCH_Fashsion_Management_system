from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.schemas.supplier_schema import (
    CreateSupplierSchema,
    UpdateSupplierSchema
)

from app.services.supplier_services.create_supplier import (
    create_supplier_service
)

from app.services.supplier_services.get_all_suppliers import (
    get_all_suppliers_service
)

from app.services.supplier_services.get_single_supplier import (
    get_single_supplier_service
)

from app.services.supplier_services.update_supplier import (
    update_supplier_service
)

from app.services.supplier_services.delete_supplier import (
    delete_supplier_service
)

from app.core.permissions import (
    require_roles
)

from app.enums.user_enums import (
    UserRole
)
from app.core.security import get_current_user
from app.models.supplier_model import Supplier

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/")
def create_supplier(

    payload: CreateSupplierSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return create_supplier_service(
        payload,
        db
    )


@router.get("/")
def get_all_suppliers(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return get_all_suppliers_service(
        db
    )


@router.get("/{supplier_id}")
def get_single_supplier(

    supplier_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER
        ])
    )
):

    return get_single_supplier_service(
        supplier_id,
        db
    )


@router.patch("/{supplier_id}")
def update_supplier(

    supplier_id: int,

    payload: UpdateSupplierSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return update_supplier_service(
        supplier_id,
        payload,
        db
    )


@router.delete("/{supplier_id}")
def delete_supplier(

    supplier_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    return delete_supplier_service(
        supplier_id,
        db
    )

