from pydantic import BaseModel
from typing import Optional, List
from app.enums.product_dev_enums import ProductDevStatus


class BOMItemCreate(BaseModel):
    material: str
    material_type: Optional[str] = None
    consumption: Optional[float] = None
    unit: Optional[str] = None
    cost: Optional[float] = None
    supplier: Optional[str] = None
    remarks: Optional[str] = None
    sort_order: Optional[int] = 0


class BOMItemUpdate(BaseModel):
    material: Optional[str] = None
    material_type: Optional[str] = None
    consumption: Optional[float] = None
    unit: Optional[str] = None
    cost: Optional[float] = None
    supplier: Optional[str] = None
    remarks: Optional[str] = None


class BOMSave(BaseModel):
    status: Optional[ProductDevStatus] = None
    items: Optional[List[BOMItemCreate]] = None


class BOMStatusUpdate(BaseModel):
    status: ProductDevStatus
