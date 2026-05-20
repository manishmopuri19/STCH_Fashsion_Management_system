from pydantic import BaseModel
from typing import Optional
from app.enums.product_dev_enums import ProductDevStatus


class StyleSheetSave(BaseModel):
    front_image_url: Optional[str] = None
    back_image_url: Optional[str] = None
    fabric_details: Optional[str] = None
    wash_details: Optional[str] = None
    stitch_details: Optional[str] = None
    fit_type: Optional[str] = None
    label_placement: Optional[str] = None
    artwork_notes: Optional[str] = None
    packaging_notes: Optional[str] = None
    status: Optional[ProductDevStatus] = None


class StyleSheetStatusUpdate(BaseModel):
    status: ProductDevStatus
