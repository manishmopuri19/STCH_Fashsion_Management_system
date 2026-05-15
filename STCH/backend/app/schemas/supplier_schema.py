from pydantic import BaseModel
from typing import Optional


class CreateSupplierSchema(BaseModel):

    company_name: str
    contact_person: str
    email: str
    phone: str
    city: str
    country: str
    specialization: str
    minimum_order_quantity: int
    lead_time: int
    address: Optional[str] = None


class UpdateSupplierSchema(BaseModel):

    company_name: str
    contact_person: str
    email: str
    phone: str
    city: str
    country: str
    specialization: str
    minimum_order_quantity: int
    lead_time: int
    address: Optional[str] = None