from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.rfq_supplier_model import (
    RFQSupplier
)
from app.schemas.rfq_supplier_schema import UpdateQuotationSchema

from app.enums.rfq_supplier_enums import (
    RFQSupplierStatus
)


def update_supplier_quotation_service(

    rfq_supplier_id: int,

    payload:UpdateQuotationSchema,

    db: Session
):

    rfq_supplier = db.query(
        RFQSupplier
    ).filter(
        RFQSupplier.id
        == rfq_supplier_id
    ).first()

    if not rfq_supplier:

        raise HTTPException(
            status_code=404,
            detail="RFQ Supplier not found"
        )

    rfq_supplier.quoted_price = (
        payload.quoted_price
    )

    rfq_supplier.remarks = (
        payload.remarks
    )

    rfq_supplier.status = (
        RFQSupplierStatus
        .QUOTATION_RECEIVED
    )

    db.commit()

    db.refresh(rfq_supplier)

    return {

        "message":
        "Quotation updated successfully"
    }