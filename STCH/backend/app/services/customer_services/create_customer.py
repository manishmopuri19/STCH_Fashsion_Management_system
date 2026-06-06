from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.customer_model import Customer
from app.schemas.customer_schema import CreateCustomerSchema


def create_customer_service(payload: CreateCustomerSchema, db: Session):
    existing = db.query(Customer).filter(
        Customer.email == payload.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="A customer with this email already exists"
        )

    customer = Customer(
        company_name=payload.company_name,
        contact_person=payload.contact_person,
        email=payload.email,
        phone=payload.phone,
        country=payload.country,
        address=payload.address,
        currency=payload.currency,
        payment_terms=payload.payment_terms,
        notes=payload.notes,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return {
        "message": "Customer created successfully",
        "customer_id": customer.id
    }
