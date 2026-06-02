from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.models.Tna_model import TNA
from app.models.rfqCollaborator_model import RFQCollaborator
from app.models.rfq_model import RFQ
from app.models.purchaseOrder_model import PurchaseOrder
from app.enums.TNAStatus_enums import TNAStatus


def get_qc_employee_detail_service(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()

    # All TNAs assigned to this QC employee
    tnas = (
        db.query(TNA)
        .filter(TNA.assigned_to == user_id)
        .order_by(TNA.planned_date.asc())
        .all()
    )

    # Build TNA list with PO number and style info
    po_ids = list({t.po_id for t in tnas})
    pos_map = {
        po.id: po
        for po in db.query(PurchaseOrder).filter(PurchaseOrder.id.in_(po_ids)).all()
    }

    tna_list = []
    for t in tnas:
        style_info = None
        if t.style_id and t.style:
            style_info = {
                "id": t.style.id,
                "style_code": t.style.style_code,
                "style_name": t.style.style_name,
            }
        po = pos_map.get(t.po_id)
        tna_list.append({
            "id": t.id,
            "po_id": t.po_id,
            "po_number": po.po_number if po else None,
            "style": style_info,
            "activity_type": t.activity_type.value,
            "custom_name": t.custom_name,
            "priority": t.priority.value if t.priority else "MEDIUM",
            "planned_date": t.planned_date,
            "actual_date": t.actual_date,
            "status": t.status.value,
            "remarks": t.remarks,
            "delayed_reason": t.delayed_reason,
        })

    # Collaborated RFQs
    rfq_ids = [
        c.rfq_id
        for c in db.query(RFQCollaborator)
        .filter(RFQCollaborator.user_id == user_id)
        .all()
    ]
    rfqs = db.query(RFQ).filter(RFQ.id.in_(rfq_ids)).all() if rfq_ids else []
    rfq_list = [
        {
            "id": r.id,
            "rfq_number": r.rfq_number,
            "brand": r.brand,
            "season": r.season,
            "department": r.department,
            "status": r.status.value,
            "delivery_date": r.delivery_date,
        }
        for r in rfqs
    ]

    # POs linked via TNAs
    po_list = [
        {
            "id": po.id,
            "po_number": po.po_number,
            "status": po.status.value,
            "quantity": po.quantity,
            "delivery_date": po.delivery_date,
        }
        for po in pos_map.values()
    ]

    return {
        "user": {
            "id": user.id,
            "userName": user.userName,
            "email": user.email,
            "role": user.role.value,
        },
        "stats": {
            "total_tnas": len(tnas),
            "pending": sum(1 for t in tnas if t.status == TNAStatus.PENDING),
            "in_progress": sum(1 for t in tnas if t.status == TNAStatus.IN_PROGRESS),
            "completed": sum(1 for t in tnas if t.status == TNAStatus.COMPLETED),
            "overdue": sum(
                1 for t in tnas
                if t.planned_date
                and t.planned_date < today
                and t.status not in [TNAStatus.COMPLETED, TNAStatus.CANCELLED]
            ),
        },
        "tnas": tna_list,
        "rfqs": rfq_list,
        "purchase_orders": po_list,
    }
