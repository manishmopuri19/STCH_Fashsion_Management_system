from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.enums.rfq_enums import RFQPriority, RFQStatus


class RFQCreate(BaseModel):
    # Required Fields (No default value)
    rfq_number: str
    brand: str
    season: str
    priority: Optional[RFQPriority]=None
    garment_type: str
    fabric_type: str
    quantity: int
    target_price: float
    currency: str
    delivery_date:Optional[date] =None  

    # Optional Fields (Must have = None or a default to avoid 422 if empty)
    department: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    fabric_weight: Optional[str] = None
    fabric_composition: Optional[str] = None
    construction: Optional[str] = None
    yarn_count: Optional[str] = None
    incoterms: Optional[str] = None
    trims_details: Optional[str] = None
    packaging_type: Optional[str] = None
    label_type: Optional[str] = None
    garment_wash: List[str] = []
    compliance_standards: List[str] = []
    tech_pack_url: Optional[str] = None
    reference_images: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[RFQStatus] = RFQStatus.NEW

    model_config = ConfigDict(from_attributes=True)

class CollaboratorRequest(BaseModel):

    user_id: int


from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.enums.rfq_enums import (
    RFQPriority,
    RFQStatus
)


class RFQResponse(BaseModel):

    id: int

    rfq_number: str

    brand: str

    season: Optional[str]

    category: Optional[str]

    garment_type: Optional[str]

    fabric_type: Optional[str]

    quantity: Optional[int]

    target_price: Optional[float]

    delivery_date: Optional[date]

    priority: Optional[RFQPriority]

    status: Optional[RFQStatus]

    model_config = {
        "from_attributes": True
    }