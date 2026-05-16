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
from typing import Optional

from pydantic import BaseModel


class UpdateSupplierSchema(BaseModel):

    company_name: Optional[str] = None

    email: Optional[str] = None

    phone: Optional[str] = None

    country: Optional[str] = None

    city: Optional[str] = None

    address: Optional[str] = None

    specialization: Optional[str] = None

    lead_time:Optional[int]=None

 