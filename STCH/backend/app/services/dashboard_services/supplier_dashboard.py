from datetime import date

from app.models.purchaseOrder_model import (
    PurchaseOrder
)

from app.models.Tna_model import TNA

from app.enums.TNAStatus_enums import (
    TNAStatus
)
from sqlalchemy.orm import Session


def get_supplier_dashboard_service(

    db:Session,

    current_user
):

    supplier_pos = db.query(
        PurchaseOrder
    ).filter(
        PurchaseOrder.supplier_id
        == current_user.id
    ).count()

    delayed_tna = db.query(TNA).filter(
        TNA.status != TNAStatus.COMPLETED,
        TNA.planned_date < date.today()
    ).count()

    return {

        "active_purchase_orders":
        supplier_pos,

        "delayed_activities":
        delayed_tna
    }