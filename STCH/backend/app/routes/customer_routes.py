from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.customer_schema import CreateCustomerSchema, UpdateCustomerSchema
from app.services.customer_services.create_customer import create_customer_service
from app.services.customer_services.get_all_customers import get_all_customers_service
from app.services.customer_services.get_single_customer import get_single_customer_service
from app.services.customer_services.update_customer import update_customer_service
from app.services.customer_services.delete_customer import delete_customer_service
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_all_customers(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    return get_all_customers_service(db)


@router.post("/")
def create_customer(
    payload: CreateCustomerSchema,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    return create_customer_service(payload, db)


@router.get("/{customer_id}")
def get_single_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    return get_single_customer_service(customer_id, db)


@router.patch("/{customer_id}")
def update_customer(
    customer_id: int,
    payload: UpdateCustomerSchema,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    return update_customer_service(customer_id, payload, db)


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN])
    )
):
    return delete_customer_service(customer_id, db)
