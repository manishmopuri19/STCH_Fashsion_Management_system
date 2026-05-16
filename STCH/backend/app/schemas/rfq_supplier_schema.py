from pydantic import BaseModel
from typing import Optional


class AssignSupplierSchema(BaseModel):

    supplier_id: int
    supplier_target_price: float
    moq: int
    lead_time: int
    payment_terms: str
    remarks: Optional[str] = None
    quoted_price: float



class UpdateQuotationSchema(BaseModel):
    quoted_price: float
    remarks: Optional[str] = None