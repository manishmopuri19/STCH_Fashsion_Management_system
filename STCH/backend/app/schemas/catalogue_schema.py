from pydantic import BaseModel
from typing import Optional


class CreateCatalogueSchema(BaseModel):

    supplier_id: Optional[int] = None
    product_name: str
    category: str
    garment_type: str
    fabric_type: str
    fabric_composition: str
    gsm: str
    wash_type: str
    print_type: Optional[str] = None
    embroidery_type: Optional[str] = None
    moq: int
    target_price: float
    lead_time: int
    image_url: Optional[str] = None
    description: Optional[str] = None


class UpdateCatalogueSchema(BaseModel):

    product_name: str
    category: str
    garment_type: str
    fabric_type: str
    fabric_composition: str
    gsm: str
    wash_type: str
    print_type: Optional[str] = None
    embroidery_type: Optional[str] = None
    moq: int
    target_price: float
    lead_time: int
    image_url: Optional[str] = None
    description: Optional[str] = None