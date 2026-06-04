from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date

from app.enums.rfq_enums import (
    RFQPriority,
    RFQStatus
)

_BLOCKED_SCHEMES = ("javascript:", "data:", "vbscript:", "file:")


class RFQCreate(BaseModel):

    # STEP 1
    brand: str
    season: str
    department: str
    category: Optional[str] = None
    sub_category: Optional[str] = None
    priority: RFQPriority

    # STEP 2
    garment_type: str
    fabric_type: str
    fabric_weight: str
    fabric_composition: str
    construction: Optional[str] = None
    yarn_count: Optional[str] = None

    # STEP 3
    quantity: int
    target_price: float
    currency: str = "INR"
    delivery_date: date
    incoterms: str

    # STEP 4
    trims_details: str
    packaging_type: str
    label_type: str

    # STEP 5
    garment_wash: list[str] = []
    dye_type: Optional[str] = None
    print_type: Optional[str] = None
    embroidery_type: Optional[str] = None
    special_finish: Optional[str] = None

    # STEP 6
    compliance_standards: list[str] = []
    testing_required: list[str] = []
    social_compliance: Optional[str] = None
    quality_standards: Optional[str] = None

    # STEP 7
    tech_pack_url: Optional[str] = None
    reference_images: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("tech_pack_url")
    @classmethod
    def validate_tech_pack_url(cls, v):
        if v and v.lower().strip().startswith(_BLOCKED_SCHEMES):
            raise ValueError("Invalid URL scheme")
        return v

    @field_validator("reference_images")
    @classmethod
    def validate_reference_images(cls, v):
        if v:
            for line in v.splitlines():
                line = line.strip()
                if line and line.lower().startswith(_BLOCKED_SCHEMES):
                    raise ValueError("Invalid URL in reference images")
        return v


class RFQStatusUpdate(BaseModel):

    status: RFQStatus