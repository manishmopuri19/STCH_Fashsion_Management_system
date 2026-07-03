from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.models.user_model import User
from app.models.po_style_model import POStyle
from app.enums.TNAStatus_enums import TNAActivityType, TNA_WORKFLOW_ORDER


def get_style_tnas_service(style_id: int, current_user, db: Session):
    style = db.query(POStyle).filter(POStyle.id == style_id).first()
    if not style:
        raise HTTPException(status_code=404, detail="Style not found")

    is_privileged = current_user.role in ["ADMIN", "MERCHANDISER"]

    # Fetch all TNAs for the style (non-privileged only see their own)
    query = db.query(TNA).filter(TNA.style_id == style_id)
    if not is_privileged:
        query = query.filter(TNA.assigned_to == current_user.id)

    tnas = query.all()

    # Order by workflow sequence position; legacy/unknown types go last
    def _step_index(t):
        try:
            return TNA_WORKFLOW_ORDER.index(TNAActivityType(t.activity_type))
        except (ValueError, KeyError):
            return 999

    tnas_sorted = sorted(tnas, key=_step_index)

    result = []
    for tna in tnas_sorted:
        try:
            activity_value = TNAActivityType(tna.activity_type).value
        except (ValueError, KeyError):
            activity_value = str(tna.activity_type)

        assigned_user = None
        if tna.assigned_to:
            u = db.query(User).filter(User.id == tna.assigned_to).first()
            if u:
                assigned_user = {"id": u.id, "name": u.userName, "role": u.role.value}

        result.append({
            "id": tna.id,
            "activity_type": activity_value,
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
