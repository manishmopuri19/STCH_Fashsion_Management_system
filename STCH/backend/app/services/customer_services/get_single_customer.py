from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.customer_model import Customer
from app.models.rfq_model import RFQ
from app.models.purchaseOrder_model import PurchaseOrder


def get_single_customer_service(customer_id: int, db: Session):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    rfqs = db.query(RFQ).filter(
        RFQ.customer_id == customer_id
    ).all()

    rfq_list = []
    for r in rfqs:
        po = db.query(PurchaseOrder).filter(
            PurchaseOrder.rfq_id == r.id
        ).first()

        rfq_list.append({
            "id": r.id,
            "rfq_number": r.rfq_number,
            "brand": r.brand,
            "garment_type": r.garment_type,
            "quantity": r.quantity,
            "target_price": r.target_price,
            "currency": r.currency,
            "status": r.status.value if r.status else None,
            "delivery_date": str(r.delivery_date) if r.delivery_date else None,
            "created_at": str(r.created_at) if r.created_at else None,
            "po_number": po.po_number if po else None,
            "po_id": po.id if po else None,
            "po_status": po.status.value if po and po.status else None,
        })

    return {
        "id": customer.id,
        "company_name": customer.company_name,
        "contact_person": customer.contact_person,
        "email": customer.email,
        "phone": customer.phone,
        "country": customer.country,
        "address": customer.address,
        "currency": customer.currency,
        "payment_terms": customer.payment_terms,
        "notes": customer.notes,
        "is_active": customer.is_active,
        "created_at": str(customer.created_at) if customer.created_at else None,
        "rfqs": rfq_list,
    }
