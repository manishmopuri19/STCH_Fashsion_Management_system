from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.models.user_model import User


def get_po_tnas_service(po_id: int, db: Session):
    tnas = (
        db.query(TNA)
        .filter(TNA.po_id == po_id)
        .order_by(TNA.planned_date.asc().nullslast())
        .all()
    )

    response = []

    for tna in tnas:
        assigned_user = None
        if tna.assigned_to:
            u = db.query(User).filter(User.id == tna.assigned_to).first()
            if u:
                assigned_user = {"id": u.id, "name": u.userName, "role": u.role.value}

        response.append({
            "id": tna.id,
            "style_id": tna.style_id,
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

    return response
