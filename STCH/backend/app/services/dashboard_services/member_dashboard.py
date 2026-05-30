from datetime import date

from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.rfqCollaborator_model import RFQCollaborator
from app.models.po_style_model import POStyle
from app.enums.TNAStatus_enums import TNAStatus


def get_member_dashboard_service(db: Session, current_user):
    today = date.today()

    # TNAs assigned to this user
    my_tnas = db.query(TNA).filter(TNA.assigned_to == current_user.id).all()

    total_assigned = len(my_tnas)
    pending = sum(1 for t in my_tnas if t.status == TNAStatus.PENDING)
    in_progress = sum(1 for t in my_tnas if t.status == TNAStatus.IN_PROGRESS)
    completed = sum(1 for t in my_tnas if t.status == TNAStatus.COMPLETED)
    delayed = sum(
        1 for t in my_tnas
        if t.status not in [TNAStatus.COMPLETED, TNAStatus.CANCELLED]
        and t.planned_date
        and t.planned_date < today
    )

    # POs accessible via RFQ collaboration
    collaborated_rfq_ids = db.query(RFQCollaborator.rfq_id).filter(
        RFQCollaborator.user_id == current_user.id
    )
    accessible_pos = db.query(PurchaseOrder).filter(
        PurchaseOrder.rfq_id.in_(collaborated_rfq_ids)
    ).count()

    # Upcoming TNAs (next 7 days, not completed)
    from datetime import timedelta
    upcoming = []
    for t in my_tnas:
        if (
            t.planned_date
            and today <= t.planned_date <= today + timedelta(days=7)
            and t.status not in [TNAStatus.COMPLETED, TNAStatus.CANCELLED]
        ):
            style_code = None
            if t.style_id:
                style = db.query(POStyle).filter(POStyle.id == t.style_id).first()
                if style:
                    style_code = style.style_code

            upcoming.append({
                "id": t.id,
                "activity": t.activity_type.value,
                "planned_date": t.planned_date,
                "status": t.status.value,
                "style_code": style_code,
                "po_id": t.po_id,
            })

    upcoming.sort(key=lambda x: x["planned_date"])

    # Overdue TNAs
    overdue = []
    for t in my_tnas:
        if (
            t.planned_date
            and t.planned_date < today
            and t.status not in [TNAStatus.COMPLETED, TNAStatus.CANCELLED]
        ):
            style_code = None
            if t.style_id:
                style = db.query(POStyle).filter(POStyle.id == t.style_id).first()
                if style:
                    style_code = style.style_code

            overdue.append({
                "id": t.id,
                "activity": t.activity_type.value,
                "planned_date": t.planned_date,
                "status": t.status.value,
                "delayed_reason": t.delayed_reason,
                "style_code": style_code,
                "po_id": t.po_id,
            })

    overdue.sort(key=lambda x: x["planned_date"])

    return {
        "stats": {
            "total_assigned": total_assigned,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "delayed": delayed,
            "accessible_pos": accessible_pos,
        },
        "upcoming_tnas": upcoming[:10],
        "overdue_tnas": overdue[:10],
    }
