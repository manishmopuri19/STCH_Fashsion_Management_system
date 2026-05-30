from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.style_color_model import StyleColor
from app.models.color_size_model import ColorSize
from app.schemas.style_schema import ColorSizeCreate


def generate_size_code(color_code: str, size_value: str) -> str:
    return f"{color_code}-SZ-{size_value}"


def create_size_service(color_id: int, payload: ColorSizeCreate, db: Session):
    color = db.query(StyleColor).filter(StyleColor.id == color_id).first()
    if not color:
        raise HTTPException(status_code=404, detail="Color not found")

    size_code = generate_size_code(color.color_code, payload.size_value)

    existing = db.query(ColorSize).filter(ColorSize.size_code == size_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Size {payload.size_value} already exists for this color")

    size = ColorSize(
        color_id=color_id,
        size_value=payload.size_value,
        size_code=size_code,
        quantity=payload.quantity,
    )
    db.add(size)
    db.commit()
    db.refresh(size)

    return {
        "id": size.id,
        "size_value": size.size_value,
        "size_code": size.size_code,
        "quantity": size.quantity,
        "message": "Size added successfully",
    }


def update_size_service(size_id: int, quantity: int, db: Session):
    size = db.query(ColorSize).filter(ColorSize.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found")
    size.quantity = quantity
    db.commit()
    db.refresh(size)
    return {"id": size.id, "quantity": size.quantity, "message": "Size updated"}


def delete_size_service(size_id: int, db: Session):
    size = db.query(ColorSize).filter(ColorSize.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found")
    db.delete(size)
    db.commit()
    return {"message": "Size deleted"}
