from typing import Optional
from pydantic import BaseModel


class CreateCustomerSchema(BaseModel):
    company_name: str
    contact_person: str
    email: str
    phone: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    currency: Optional[str] = "USD"
    payment_terms: Optional[str] = None
    notes: Optional[str] = None


class UpdateCustomerSchema(BaseModel):
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    currency: Optional[str] = None
    payment_terms: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None
