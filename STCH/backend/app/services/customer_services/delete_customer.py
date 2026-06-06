from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.customer_model import Customer


def delete_customer_service(customer_id: int, db: Session):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(customer)
    db.commit()

    return {"message": "Customer deleted successfully"}
