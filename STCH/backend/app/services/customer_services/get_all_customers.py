from sqlalchemy.orm import Session
from app.models.customer_model import Customer
from app.models.rfq_model import RFQ


def get_all_customers_service(db: Session):
    customers = db.query(Customer).all()

    result = []
    for c in customers:
        rfq_count = db.query(RFQ).filter(
            RFQ.customer_id == c.id
        ).count()

        result.append({
            "id": c.id,
            "company_name": c.company_name,
            "contact_person": c.contact_person,
            "email": c.email,
            "phone": c.phone,
            "country": c.country,
            "currency": c.currency,
            "payment_terms": c.payment_terms,
            "is_active": c.is_active,
            "rfq_count": rfq_count,
            "created_at": str(c.created_at) if c.created_at else None,
        })

    return result
