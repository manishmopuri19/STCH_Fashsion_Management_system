from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.rfq_model import RFQ

from app.models.supplier_model import Supplier
from app.schemas.rfq_supplier_schema import AssignSupplierSchema
from app.models.rfq_supplier_model import RFQSupplier


def assign_supplier_service(

    rfq_id: int,

    payload:AssignSupplierSchema,

    db: Session
):

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:

        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    supplier = db.query(Supplier).filter(
        Supplier.id == payload.supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    existing_match = db.query(
        RFQSupplier
    ).filter(

        RFQSupplier.rfq_id == rfq_id,

        RFQSupplier.supplier_id
        == payload.supplier_id

    ).first()

    if existing_match:

        raise HTTPException(
            status_code=400,
            detail="Supplier already assigned"
        )

    rfq_supplier = RFQSupplier(

        rfq_id=rfq_id,

        supplier_id=payload.supplier_id,

        supplier_target_price=
        payload.supplier_target_price,

        moq=payload.moq,
        

        lead_time=payload.lead_time,
         quoted_price=
        payload.quoted_price,

        payment_terms=
        payload.payment_terms,

        remarks=payload.remarks
    )

    db.add(rfq_supplier)

    db.commit()

    db.refresh(rfq_supplier)

    return rfq_supplier