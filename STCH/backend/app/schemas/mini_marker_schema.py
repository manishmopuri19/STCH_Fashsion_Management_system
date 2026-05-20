from pydantic import BaseModel
from typing import Optional
from app.enums.product_dev_enums import ProductDevStatus


class MiniMarkerSave(BaseModel):
    fabric_width: Optional[float] = None
    gsm: Optional[float] = None
    size_ratio: Optional[str] = None
    marker_efficiency: Optional[float] = None
    wastage_pct: Optional[float] = None
    consumption: Optional[float] = None
    cad_ratio: Optional[float] = None
    fabric_cost: Optional[float] = None
    cad_file_url: Optional[str] = None
    marker_image_url: Optional[str] = None
    status: Optional[ProductDevStatus] = None


class MiniMarkerStatusUpdate(BaseModel):
    status: ProductDevStatus
