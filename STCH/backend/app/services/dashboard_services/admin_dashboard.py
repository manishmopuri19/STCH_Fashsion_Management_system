from sqlalchemy import func

from datetime import date

from app.models.rfq_model import RFQ
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.Tna_model import TNA
from app.models.quality_inspection_model import (
    QualityInspection
)

from app.enums.TNAStatus_enums import TNAStatus
from app.enums.qc_enums import QCResult
from sqlalchemy.orm import Session


def get_admin_dashboard_service(db:Session):

    total_rfqs = db.query(RFQ).count()

    total_pos = db.query(
        PurchaseOrder
    ).count()

    total_po_value = db.query(
        func.sum(
            PurchaseOrder.total_amount
        )
    ).scalar() or 0

    avg_margin = db.query(
        func.avg(
            PurchaseOrder.margin
        )
    ).scalar() or 0

    delayed_tna = db.query(TNA).filter(
        TNA.status != TNAStatus.COMPLETED,
        TNA.planned_date < date.today()
    ).count()

    qc_total = db.query(
        QualityInspection
    ).count()

    qc_passed = db.query(
        QualityInspection
    ).filter(
        QualityInspection.result
        == QCResult.PASSED
    ).count()

    qc_pass_rate = 0

    if qc_total > 0:

        qc_pass_rate = (
            qc_passed / qc_total
        ) * 100

    return {

        "rfqs": {

            "total_rfqs":
            total_rfqs
        },

        "purchase_orders": {

            "total_pos":
            total_pos,

            "total_po_value":
            total_po_value,

            "avg_margin":
            round(avg_margin, 2)
        },

        "tna": {

            "delayed_tna":
            delayed_tna
        },

        "qc": {

            "pass_rate":
            round(qc_pass_rate, 2)
        }
    }