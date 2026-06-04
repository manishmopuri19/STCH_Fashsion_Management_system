from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
import os
import shutil
import uuid

from app.models.po_style_model import POStyle
from app.models.style_color_model import StyleColor
from app.schemas.style_schema import StyleColorCreate


UPLOAD_DIR = "uploads/fabric_swatches"
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

# Magic bytes for common image types
_IMAGE_SIGNATURES = [
    b"\xff\xd8\xff",        # JPEG
    b"\x89PNG\r\n\x1a\n",  # PNG
    b"GIF87a",              # GIF
    b"GIF89a",              # GIF
    b"RIFF",                # WebP (RIFF....WEBP)
]


def _is_image_bytes(header: bytes) -> bool:
    for sig in _IMAGE_SIGNATURES:
        if header[:len(sig)] == sig:
            return True
    return False


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
        ext = os.path.splitext(fabric_image.filename)[-1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Only JPG, PNG, GIF, or WebP images are allowed")

        content = fabric_image.file.read()
        if len(content) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail="Image must be under 5 MB")
        if not _is_image_bytes(content):
            raise HTTPException(status_code=400, detail="File content does not match a supported image format")

        os.makedirs(UPLOAD_DIR, exist_ok=True)
        filename = f"{uuid.uuid4()}{ext}"
        full_path = os.path.join(UPLOAD_DIR, filename)
        with open(full_path, "wb") as f:
            f.write(content)
        image_path = f"/uploads/fabric_swatches/{filename}"

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
