from fastapi import HTTPException

from sqlalchemy.orm import Session
from app.models.rfq_model import RFQ
from app.models.rfq_supplier_model import (RFQSupplier)
from app.models.purchaseOrder_model import (PurchaseOrder)
from app.enums.rfq_enums import (RFQStatus)
from app.enums.POstatus_enums import (POStatus)
from app.enums.user_enums import UserRole
from app.services.tna_services.generate_default_tna import (generate_default_tna_service)




def convert_rfq_to_po_service(rfq_id: int,payload, db: Session,current_user):

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    # Only the RFQ creator or an admin can convert to PO
    if current_user.role != UserRole.ADMIN and rfq.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the RFQ creator or an admin can convert this RFQ to a PO"
        )

    existing_po = db.query(PurchaseOrder).filter(
        PurchaseOrder.rfq_id == rfq_id
    ).first()

    if existing_po:
        raise HTTPException(
            status_code=400,
            detail=f"A Purchase Order already exists for this RFQ: {existing_po.po_number}"
        )

    rfq_supplier = db.query(
        RFQSupplier
    ).filter(
        RFQSupplier.id
        == payload.rfq_supplier_id
    ).first()

    if not rfq_supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier quotation not found"
        )

    if not rfq_supplier.quoted_price:
        raise HTTPException(
            status_code=400,
            detail="Supplier quotation missing"
        )

    supplier_price = (rfq_supplier.quoted_price)

    target_price = rfq.target_price

    if not target_price or target_price == 0:
        raise HTTPException(
            status_code=400,
            detail="RFQ target price cannot be zero"
        )

    margin = (
        target_price -
        supplier_price
    )

    profitability = (
        (margin / target_price) * 100
    )

    total_amount = (supplier_price *
        rfq.quantity
    )

    po = PurchaseOrder(

        po_number="TMP",

        rfq_id=rfq.id,

        supplier_id=
        rfq_supplier.supplier_id,
        quantity=rfq.quantity,
        target_price=target_price,
        supplier_price=supplier_price,
        margin=margin,
        profitability=profitability,

        total_amount=total_amount,
        currency="INR",

        delivery_date=
        rfq.delivery_date,

        lead_time=
        rfq_supplier.lead_time,

        payment_terms=
        rfq_supplier.payment_terms,

        status=POStatus.CREATED,

        created_by=current_user.id
    )

    db.add(po)
    db.flush()  # get po.id before committing

    po.po_number = f"PO-2026-{po.id:04d}"

    rfq.status = (
        RFQStatus.PO_CREATED
    )

    db.commit()

    db.refresh(po)

    # GENERATE DEFAULT TNA
    generate_default_tna_service(
        po.id,
        db
    )

    return {

        "message":
        "PO created successfully",
        "po_id": po.id,
        "po_number": po.po_number
    }