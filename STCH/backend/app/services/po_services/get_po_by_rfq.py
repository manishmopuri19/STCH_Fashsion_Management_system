from sqlalchemy.orm import Session
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.rfq_model import RFQ
from app.utils.rfq_permissions import can_access_rfq


def get_po_by_rfq_service(rfq_id: int, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.rfq_id == rfq_id
    ).first()

    if not po:
        return None

    return {"id": po.id, "po_number": po.po_number, "status": po.status}
