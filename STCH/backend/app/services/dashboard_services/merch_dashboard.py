from datetime import date

from app.models.rfq_model import RFQ

from app.models.purchaseOrder_model import (
    PurchaseOrder
)

from app.models.Tna_model import TNA

from app.enums.TNAStatus_enums import (
    TNAStatus
)
from sqlalchemy.orm import Session


def get_merch_dashboard_service(

    db:Session,

    current_user
):

    active_rfqs = db.query(RFQ).filter(
        RFQ.assigned_to == current_user.id
    ).count()

    active_pos = db.query(
        PurchaseOrder
    ).filter(
        PurchaseOrder.created_by
        == current_user.id
    ).count()

    delayed_tna = db.query(TNA).filter(
        TNA.assigned_to == current_user.id,
        TNA.status != TNAStatus.COMPLETED,
        TNA.planned_date < date.today()
    ).count()

    return {

        "my_rfqs":
        active_rfqs,

        "my_purchase_orders":
        active_pos,

        "delayed_tna":
        delayed_tna
    }