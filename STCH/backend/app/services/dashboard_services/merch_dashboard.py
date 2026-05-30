from datetime import date

from sqlalchemy.orm import Session

from app.models.rfq_model import RFQ
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.Tna_model import TNA
from app.models.rfq_supplier_model import RFQSupplier
from app.models.rfqCollaborator_model import RFQCollaborator
from app.enums.TNAStatus_enums import TNAStatus
from app.enums.rfq_enums import RFQStatus


def get_merch_dashboard_service(db: Session, current_user):
    today = date.today()

    # RFQs this merchandiser owns or collaborates on
    collaborated_ids = db.query(RFQCollaborator.rfq_id).filter(
        RFQCollaborator.user_id == current_user.id
    )
    my_rfq_ids = db.query(RFQ.id).filter(
        (RFQ.created_by == current_user.id) | RFQ.id.in_(collaborated_ids)
    )

    assigned_rfqs = db.query(RFQ).filter(RFQ.id.in_(my_rfq_ids)).count()

    negotiation_rfqs = db.query(RFQ).filter(
        RFQ.id.in_(my_rfq_ids),
        RFQ.status == RFQStatus.QUOTED
    ).count()

    # Pending quotations (RFQs waiting for supplier quotes)
    pending_quotations = db.query(RFQSupplier).join(
        RFQ, RFQ.id == RFQSupplier.rfq_id
    ).filter(
        RFQ.id.in_(my_rfq_ids),
        RFQSupplier.quoted_price == None
    ).count()

    # POs for merchandiser's RFQs
    my_pos = db.query(PurchaseOrder).filter(
        PurchaseOrder.rfq_id.in_(my_rfq_ids)
    )

    from datetime import timedelta
    urgent_deliveries = my_pos.filter(
        PurchaseOrder.delivery_date != None,
        PurchaseOrder.delivery_date <= today + timedelta(days=14)
    ).count()

    # Delayed TNAs on their POs
    my_po_ids = db.query(PurchaseOrder.id).filter(
        PurchaseOrder.rfq_id.in_(my_rfq_ids)
    )
    delayed_tna = db.query(TNA).filter(
        TNA.po_id.in_(my_po_ids),
        TNA.status != TNAStatus.COMPLETED,
        TNA.status != TNAStatus.CANCELLED,
        TNA.planned_date != None,
        TNA.planned_date < today
    ).count()

    # Pipeline breakdown
    pipeline = {}
    for status in RFQStatus:
        count = db.query(RFQ).filter(
            RFQ.id.in_(my_rfq_ids),
            RFQ.status == status
        ).count()
        if count > 0:
            pipeline[status.value.replace("_", " ")] = count

    # Urgent RFQs (HIGH/CRITICAL priority, not yet PO)
    from app.enums.rfq_enums import RFQPriority
    urgent_rfqs = db.query(RFQ).filter(
        RFQ.id.in_(my_rfq_ids),
        RFQ.status.notin_([RFQStatus.PO_CREATED, RFQStatus.CLOSED]),
        RFQ.priority.in_([RFQPriority.HIGH, RFQPriority.CRITICAL])
    ).limit(5).all()

    return {
        "rfqs": {
            "assigned_rfqs": assigned_rfqs,
            "negotiation_rfqs": negotiation_rfqs,
        },
        "quotations": {
            "pending": pending_quotations,
        },
        "purchase_orders": {
            "urgent_deliveries": urgent_deliveries,
        },
        "tna": {
            "delayed": delayed_tna,
        },
        "pipeline": pipeline,
        "urgent_rfqs": [
            {"id": r.id, "rfq_number": r.rfq_number, "brand": r.brand, "priority": r.priority.value}
            for r in urgent_rfqs
        ],
        "activities": [],
    }
