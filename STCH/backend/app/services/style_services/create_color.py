from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
import os
import shutil
import uuid

from app.models.po_style_model import POStyle
from app.models.style_color_model import StyleColor
from app.schemas.style_schema import StyleColorCreate


UPLOAD_DIR = "uploads/fabric_swatches"


def generate_color_code(style_code: str, style_id: int, db: Session) -> str:
    count = db.query(StyleColor).filter(StyleColor.style_id == style_id).count()
    return f"{style_code}-CLR-{count + 1:03d}"


def create_color_service(
    style_id: int,
    color_name: str,
    hex_value: str | None,
    db: Session,
    fabric_image: UploadFile | None = None,
):
    style = db.query(POStyle).filter(POStyle.id == style_id).first()
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")

    color_code = generate_color_code(style.style_code, style_id, db)

    image_path = None
    if fabric_image and fabric_image.filename:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        ext = os.path.splitext(fabric_image.filename)[-1]
        filename = f"{color_code}{ext}"
        full_path = os.path.join(UPLOAD_DIR, filename)
        with open(full_path, "wb") as f:
            shutil.copyfileobj(fabric_image.file, f)
        image_path = f"/{full_path}"

    color = StyleColor(
        style_id=style_id,
        color_name=color_name,
        color_code=color_code,
        hex_value=hex_value,
        fabric_image_path=image_path,
    )
    db.add(color)
    db.commit()
    db.refresh(color)

    return {
        "id": color.id,
        "color_name": color.color_name,
        "color_code": color.color_code,
        "hex_value": color.hex_value,
        "fabric_image_path": color.fabric_image_path,
        "message": "Color added successfully",
    }
