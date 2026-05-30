from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.models.user_model import User
from app.models.po_style_model import POStyle


def get_style_tnas_service(style_id: int, current_user, db: Session):
    style = db.query(POStyle).filter(POStyle.id == style_id).first()
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")

    query = db.query(TNA).filter(TNA.style_id == style_id)

    is_privileged = current_user.role in ["ADMIN", "MERCHANDISER"]
    if not is_privileged:
        query = query.filter(TNA.assigned_to == current_user.id)

    tnas = query.order_by(TNA.planned_date.asc()).all()

    result = []
    for tna in tnas:
        assigned_user = None
        if tna.assigned_to:
            u = db.query(User).filter(User.id == tna.assigned_to).first()
            if u:
                assigned_user = {"id": u.id, "name": u.userName, "role": u.role.value}

        result.append({
            "id": tna.id,
            "activity_type": tna.activity_type.value,
            "priority": tna.priority.value if tna.priority else "MEDIUM",
            "planned_date": tna.planned_date,
            "actual_date": tna.actual_date,
            "status": tna.status.value,
            "remarks": tna.remarks,
            "delayed_reason": tna.delayed_reason,
            "assigned_to": tna.assigned_to,
            "assigned_user": assigned_user,
        })

    return result


def get_my_tnas_service(current_user, db: Session):
    tnas = (
        db.query(TNA)
        .filter(TNA.assigned_to == current_user.id)
        .order_by(TNA.planned_date.asc())
        .all()
    )

    result = []
    for tna in tnas:
        style_info = None
        if tna.style_id and tna.style:
            style_info = {
                "id": tna.style.id,
                "style_code": tna.style.style_code,
                "style_name": tna.style.style_name,
            }

        result.append({
            "id": tna.id,
            "po_id": tna.po_id,
            "style": style_info,
            "activity_type": tna.activity_type.value,
            "priority": tna.priority.value if tna.priority else "MEDIUM",
            "planned_date": tna.planned_date,
            "actual_date": tna.actual_date,
            "status": tna.status.value,
            "remarks": tna.remarks,
            "delayed_reason": tna.delayed_reason,
        })

    return result
