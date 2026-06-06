from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.supplier_model import Supplier
from app.models.rfq_supplier_model import RFQSupplier
from app.models.rfq_model import RFQ
from app.models.purchaseOrder_model import PurchaseOrder


def get_single_supplier_service(supplier_id: int, db: Session):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()

    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # RFQ quotations this supplier was invited to / submitted quotes for
    quotations = (
        db.query(RFQSupplier)
        .filter(RFQSupplier.supplier_id == supplier_id)
        .all()
    )

    rfq_list = []
    for q in quotations:
        rfq = db.query(RFQ).filter(RFQ.id == q.rfq_id).first()
        if not rfq:
            continue
        rfq_list.append({
            "rfq_supplier_id": q.id,
            "rfq_id": rfq.id,
            "rfq_number": rfq.rfq_number,
            "brand": rfq.brand,
            "garment_type": rfq.garment_type,
            "quantity": rfq.quantity,
            "delivery_date": str(rfq.delivery_date) if rfq.delivery_date else None,
            "rfq_status": rfq.status.value if rfq.status else None,
            "quoted_price": q.quoted_price,
            "supplier_target_price": q.supplier_target_price,
            "quote_status": q.status.value if q.status else None,
            "payment_terms": q.payment_terms,
            "lead_time": q.lead_time,
            "remarks": q.remarks,
        })

    # Purchase orders awarded to this supplier
    pos = (
        db.query(PurchaseOrder)
        .filter(PurchaseOrder.supplier_id == supplier_id)
        .all()
    )

    po_list = []
    for po in pos:
        rfq = db.query(RFQ).filter(RFQ.id == po.rfq_id).first() if po.rfq_id else None
        po_list.append({
            "id": po.id,
            "po_number": po.po_number,
            "rfq_number": rfq.rfq_number if rfq else None,
            "rfq_id": po.rfq_id,
            "brand": rfq.brand if rfq else None,
            "garment_type": rfq.garment_type if rfq else None,
            "quantity": po.quantity,
            "supplier_price": po.supplier_price,
            "total_amount": po.total_amount,
            "currency": po.currency,
            "delivery_date": str(po.delivery_date) if po.delivery_date else None,
            "status": po.status.value if po.status else None,
            "payment_terms": po.payment_terms,
            "created_at": str(po.created_at) if po.created_at else None,
        })

    return {
        "id": supplier.id,
        "company_name": supplier.company_name,
        "contact_person": supplier.contact_person,
        "email": supplier.email,
        "phone": supplier.phone,
        "city": supplier.city,
        "country": supplier.country,
        "address": supplier.address,
        "specialization": supplier.specialization,
        "minimum_order_quantity": supplier.minimum_order_quantity,
        "lead_time": supplier.lead_time,
        "created_at": str(supplier.created_at) if supplier.created_at else None,
        "rfq_quotations": rfq_list,
        "purchase_orders": po_list,
    }
