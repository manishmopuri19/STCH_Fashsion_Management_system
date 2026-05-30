from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.po_style_model import POStyle
from app.models.style_color_model import StyleColor
from app.models.color_size_model import ColorSize


def get_styles_service(po_id: int, db: Session):
    styles = db.query(POStyle).filter(POStyle.po_id == po_id).all()

    result = []
    for style in styles:
        colors = []
        for color in style.colors:
            sizes = [
                {
                    "id": s.id,
                    "size_value": s.size_value,
                    "size_code": s.size_code,
                    "quantity": s.quantity,
                }
                for s in color.sizes
            ]
            colors.append({
                "id": color.id,
                "color_name": color.color_name,
                "color_code": color.color_code,
                "hex_value": color.hex_value,
                "fabric_image_path": color.fabric_image_path,
                "sizes": sizes,
            })

        total_quantity = sum(
            s.quantity
            for color in style.colors
            for s in color.sizes
        )

        result.append({
            "id": style.id,
            "style_name": style.style_name,
            "style_code": style.style_code,
            "description": style.description,
            "color_count": len(style.colors),
            "total_quantity": total_quantity,
            "colors": colors,
            "created_at": style.created_at,
        })

    return result


def get_style_detail_service(style_id: int, db: Session):
    style = db.query(POStyle).filter(POStyle.id == style_id).first()
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")

    colors = []
    for color in style.colors:
        sizes = [
            {
                "id": s.id,
                "size_value": s.size_value,
                "size_code": s.size_code,
                "quantity": s.quantity,
            }
            for s in color.sizes
        ]
        colors.append({
            "id": color.id,
            "color_name": color.color_name,
            "color_code": color.color_code,
            "hex_value": color.hex_value,
            "fabric_image_path": color.fabric_image_path,
            "sizes": sizes,
        })

    return {
        "id": style.id,
        "po_id": style.po_id,
        "style_name": style.style_name,
        "style_code": style.style_code,
        "description": style.description,
        "colors": colors,
        "created_at": style.created_at,
    }
