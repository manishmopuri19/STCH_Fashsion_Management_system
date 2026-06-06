from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.customer_model import Customer
from app.schemas.customer_schema import UpdateCustomerSchema


def update_customer_service(customer_id: int, payload: UpdateCustomerSchema, db: Session):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = payload.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)

    return {
        "message": "Customer updated successfully",
        "customer": {
            "id": customer.id,
            "company_name": customer.company_name,
            "contact_person": customer.contact_person,
            "email": customer.email,
            "phone": customer.phone,
            "country": customer.country,
            "currency": customer.currency,
            "payment_terms": customer.payment_terms,
            "is_active": customer.is_active,
        }
    }
