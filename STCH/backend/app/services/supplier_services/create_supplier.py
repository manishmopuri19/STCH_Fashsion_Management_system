from app.models.supplier_model import (
    Supplier
)
from sqlalchemy.orm import Session
from app.schemas.supplier_schema import CreateSupplierSchema

def create_supplier_service(

    payload:CreateSupplierSchema,

    db:Session
):

    supplier = Supplier(

        company_name=
        payload.company_name,

        contact_person=
        payload.contact_person,

        email=
        payload.email,

        phone=
        payload.phone,

        city=
        payload.city,

        country=
        payload.country,

        specialization=
        payload.specialization,

        minimum_order_quantity=
        payload.minimum_order_quantity,

        lead_time=
        payload.lead_time,

        address=
        payload.address
    )

    db.add(supplier)

    db.commit()

    db.refresh(supplier)

    return {

        "message":
        "Supplier created successfully",

        "supplier_id":
        supplier.id
    }