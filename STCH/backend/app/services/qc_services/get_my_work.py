from sqlalchemy.orm import Session

from app.models.quality_inspection_model import QualityInspection
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.supplier_model import Supplier
from app.enums.qc_enums import QCStatus


def _batch_format_inspections(inspections: list, db: Session) -> list:
    if not inspections:
        return []

    po_ids = list({i.po_id for i in inspections if i.po_id})
    pos = {
        p.id: p
        for p in db.query(PurchaseOrder).filter(PurchaseOrder.id.in_(po_ids)).all()
    }

    supplier_ids = list({p.supplier_id for p in pos.values() if p.supplier_id})
    suppliers = {
        s.id: s
        for s in db.query(Supplier).filter(Supplier.id.in_(supplier_ids)).all()
    }

    result = []
    for insp in inspections:
        po = pos.get(insp.po_id)
        supplier_name = None
        if po and po.supplier_id:
            sup = suppliers.get(po.supplier_id)
            supplier_name = sup.company_name if sup else None

        result.append({
            "id": insp.id,
            "inspection_type": insp.inspection_type.value if insp.inspection_type else None,
            "inspection_date": str(insp.inspection_date) if insp.inspection_date else None,
            "status": insp.status.value if insp.status else None,
            "result": insp.result.value if insp.result else None,
            "aql_level": insp.aql_level,
            "total_checked": insp.total_checked,
            "passed_quantity": insp.passed_quantity,
            "failed_quantity": insp.failed_quantity,
            "remarks": insp.remarks,
            "created_at": str(insp.created_at),
            "defect_count": len(insp.defects) if insp.defects else 0,
            "po": {
                "id": po.id,
                "po_number": po.po_number,
                "delivery_date": str(po.delivery_date) if po.delivery_date else None,
                "quantity": po.quantity,
                "currency": po.currency,
                "supplier_name": supplier_name,
            } if po else None,
        })

    return result


def get_my_work_service(current_user, db: Session) -> list:
    inspections = (
        db.query(QualityInspection)
        .filter(
            QualityInspection.assigned_to == current_user.id,
            QualityInspection.status.in_([QCStatus.PENDING, QCStatus.IN_PROGRESS]),
        )
        .order_by(QualityInspection.created_at.desc())
        .all()
    )
    return _batch_format_inspections(inspections, db)
