from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.schemas.rfq_supplier_schema import (
    AssignSupplierSchema,
    UpdateQuotationSchema
)

from app.services.rfq_services.assign_supplier import (
    assign_supplier_service
)

from app.services.rfq_services.get_rfq_suppliers import (
    get_rfq_suppliers_service
)

from app.services.rfq_services.update_supplier_quotation import (
    update_supplier_quotation_service
)

from app.core.permissions import (
    require_roles
)

from app.enums.user_enums import (
    UserRole
)

router = APIRouter(
    prefix="/rfqs",
    tags=["RFQ Suppliers"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/{rfq_id}/suppliers")
def assign_supplier(

    rfq_id: int,

    payload: AssignSupplierSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return assign_supplier_service(
        rfq_id,
        payload,
        db
    )


@router.get("/{rfq_id}/suppliers")
def get_rfq_suppliers(

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

    return get_rfq_suppliers_service(
        rfq_id,
        db
    )


@router.patch(
    "/suppliers/{rfq_supplier_id}/quotation"
)
def update_supplier_quotation(

    rfq_supplier_id: int,

    payload: UpdateQuotationSchema,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.SUPPLIER,
            UserRole.ADMIN
        ])
    )
):

    return update_supplier_quotation_service(
        rfq_supplier_id,
        payload,
        db
    )