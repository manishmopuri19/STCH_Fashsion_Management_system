from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ColorSizeCreate(BaseModel):
    size_value: str
    quantity: int


class ColorSizeResponse(BaseModel):
    id: int
    size_value: str
    size_code: str
    quantity: int

    class Config:
        from_attributes = True


class StyleColorCreate(BaseModel):
    color_name: str
    hex_value: Optional[str] = None


class StyleColorResponse(BaseModel):
    id: int
    color_name: str
    color_code: str
    hex_value: Optional[str] = None
    fabric_image_path: Optional[str] = None
    sizes: List[ColorSizeResponse] = []

    class Config:
        from_attributes = True


class POStyleCreate(BaseModel):
    style_name: str
    description: Optional[str] = None


class POStyleResponse(BaseModel):
    id: int
    style_name: str
    style_code: str
    description: Optional[str] = None
    colors: List[StyleColorResponse] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
