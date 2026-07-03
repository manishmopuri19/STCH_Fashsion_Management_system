from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.po_style_model import POStyle
from app.models.style_color_model import StyleColor
from app.models.color_size_model import ColorSize
from app.models.Tna_model import TNA
from app.enums.TNAStatus_enums import TNAActivityType, TNAStatus, TNA_WORKFLOW_ORDER


def _get_tna_progress(style_id: int, db: Session) -> dict:
    tnas = db.query(TNA).filter(TNA.style_id == style_id).all()

    tna_map = {}
    for t in tnas:
        try:
            act = TNAActivityType(t.activity_type)
            if act in TNA_WORKFLOW_ORDER:
                tna_map[act] = TNAStatus(t.status)
        except (ValueError, KeyError):
            pass

    total = len(TNA_WORKFLOW_ORDER)
    completed_count = sum(1 for a in TNA_WORKFLOW_ORDER if tna_map.get(a) == TNAStatus.COMPLETED)

    current_step = None
    for i, step in enumerate(TNA_WORKFLOW_ORDER):
        st = tna_map.get(step)
        if st == TNAStatus.IN_PROGRESS:
            current_step = {"index": i, "activity": step.value, "status": "IN_PROGRESS"}
            break
        if st != TNAStatus.COMPLETED:
            current_step = {"index": i, "activity": step.value, "status": st.value if st else "PENDING"}
            break

    if current_step is None:
        current_step = {"index": total - 1, "activity": TNA_WORKFLOW_ORDER[-1].value, "status": "COMPLETED"}

    return {
        "completed_count": completed_count,
        "total": total,
        "current_step_index": current_step["index"],
        "current_activity": current_step["activity"],
        "current_status": current_step["status"],
        "all_done": completed_count == total,
    }


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
            "tna_progress": _get_tna_progress(style.id, db),
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
