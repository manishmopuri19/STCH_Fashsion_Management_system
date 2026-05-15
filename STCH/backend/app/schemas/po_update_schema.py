from pydantic import BaseModel


class UpdatePOCommercialSchema(BaseModel):

    supplier_price: float
    lead_time: int
    payment_terms: str