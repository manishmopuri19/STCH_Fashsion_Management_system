from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.supplier_model import (
    Supplier
)
from app.schemas.supplier_schema import UpdateSupplierSchema


def update_supplier_service(

    supplier_id: int,

    payload:UpdateSupplierSchema,

    db: Session
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    supplier.company_name = (
        payload.company_name
    )

    supplier.contact_person = (
        payload.contact_person
    )

    supplier.email = (
        payload.email
    )

    supplier.phone = (
        payload.phone
    )

    supplier.city = (
        payload.city
    )

    supplier.country = (
        payload.country
    )

    supplier.specialization = (
        payload.specialization
    )

    supplier.minimum_order_quantity = (
        payload.minimum_order_quantity
    )

    supplier.lead_time = (
        payload.lead_time
    )

    supplier.address = (
        payload.address
    )

    db.commit()

    db.refresh(supplier)

    return {

        "message":
        "Supplier updated successfully"
    }