from datetime import date

from app.models.purchaseOrder_model import PurchaseOrder
from app.models.rfq_supplier_model import RFQSupplier
from app.models.rfq_model import RFQ
from app.models.supplier_model import Supplier
from app.models.Tna_model import TNA
from app.enums.TNAStatus_enums import TNAStatus

from sqlalchemy.orm import Session


def get_supplier_dashboard_service(

    db: Session,

    current_user
):

    # Resolve user → supplier profile
    supplier_profile = db.query(Supplier).filter(
        Supplier.user_id == current_user.id
    ).first()

    empty = {
        "rfqs": {"assigned_rfqs": 0},
        "quotations": {"submitted": 0},
        "purchase_orders": {"active": 0},
        "deliveries": {"pending": 0},
        "assigned_rfqs": [],
        "active_pos": [],
        "tna_tasks": []
    }

    if not supplier_profile:
        return empty

    supplier_id = supplier_profile.id

    # Assigned RFQ records
    assignments = db.query(RFQSupplier).filter(
        RFQSupplier.supplier_id == supplier_id
    ).all()

    assigned_rfq_count = len(assignments)
    submitted_count = sum(
        1 for a in assignments if a.quoted_price is not None
    )

    # POs for this supplier
    pos = db.query(PurchaseOrder).filter(
        PurchaseOrder.supplier_id == supplier_id
    ).order_by(PurchaseOrder.created_at.desc()).all()

    active_po_count = len(pos)
    pending_delivery_count = sum(
        1 for po in pos
        if po.status.value not in ["DELIVERED", "CANCELLED", "CLOSED"]
    )

    # Build assigned RFQ list
    rfq_ids = [a.rfq_id for a in assignments]
    assigned_rfq_details = []

    if rfq_ids:
        rfqs = {
            r.id: r
            for r in db.query(RFQ).filter(RFQ.id.in_(rfq_ids)).all()
        }
        for assignment in assignments:
            rfq = rfqs.get(assignment.rfq_id)
            if rfq:
                assigned_rfq_details.append({
                    "id": rfq.id,
                    "rfq_number": rfq.rfq_number,
                    "brand": rfq.brand
                })

    # Build active PO list
    po_details = [
        {
            "id": po.id,
            "po_number": po.po_number,
            "quantity": po.quantity,
            "delivery_date": (
                str(po.delivery_date)
                if po.delivery_date else None
            )
        }
        for po in pos
    ]

    # TNA tasks for supplier's POs
    po_ids = [po.id for po in pos]
    tna_tasks = []

    if po_ids:
        po_number_map = {po.id: po.po_number for po in pos}

        tnas = db.query(TNA).filter(
            TNA.po_id.in_(po_ids),
            TNA.status != TNAStatus.COMPLETED
        ).order_by(TNA.planned_date).limit(10).all()

        for tna in tnas:
            tna_tasks.append({
                "id": tna.id,
                "title": tna.activity_type.value,
                "po_number": po_number_map.get(tna.po_id, ""),
                "due_date": (
                    str(tna.planned_date)
                    if tna.planned_date else None
                )
            })

    return {
        "rfqs": {"assigned_rfqs": assigned_rfq_count},
        "quotations": {"submitted": submitted_count},
        "purchase_orders": {"active": active_po_count},
        "deliveries": {"pending": pending_delivery_count},
        "assigned_rfqs": assigned_rfq_details,
        "active_pos": po_details,
        "tna_tasks": tna_tasks
    }
