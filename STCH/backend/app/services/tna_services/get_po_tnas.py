from sqlalchemy.orm import Session

from app.models.Tna_model import TNA

from app.models.user_model import User


def get_po_tnas_service(

    po_id: int,

    db: Session
):

    tnas = db.query(TNA).filter(
        TNA.po_id == po_id
    ).order_by(
        TNA.planned_date.asc()
    ).all()

    response = []

    for tna in tnas:

        assigned_user = None

        if tna.assigned_to:

            assigned_user = db.query(
                User
            ).filter(
                User.id == tna.assigned_to
            ).first()

        response.append({

            "id": tna.id,

            "activity_type":
            tna.activity_type.value,

            "priority":
            tna.priority.value,

            "planned_date":
            tna.planned_date,

            "actual_date":
            tna.actual_date,

            "status":
            tna.status.value,

            "remarks":
            tna.remarks,

            "assigned_to":
            assigned_user.userName
            if assigned_user
            else None
        })

    return response