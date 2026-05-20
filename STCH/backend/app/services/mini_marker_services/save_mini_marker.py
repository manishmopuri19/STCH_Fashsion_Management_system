from sqlalchemy.orm import Session
from app.models.mini_marker_model import MiniMarker
from app.schemas.mini_marker_schema import MiniMarkerSave
from app.utils.rfq_permissions import can_access_rfq
from app.enums.product_dev_enums import ProductDevStatus


def _calculate_fields(record: MiniMarker):
    try:
        consumption = record.consumption or 0
        wastage = record.wastage_pct or 0
        fabric_cost = record.fabric_cost or 0
        marker_eff = record.marker_efficiency or 100

        total_fabric = consumption * (1 + wastage / 100) if consumption else None
        yield_val = (marker_eff / 100) if marker_eff else None
        fabric_util = marker_eff
        cost_per_piece = (total_fabric * fabric_cost) if (total_fabric and fabric_cost) else None
        margin_impact = ((cost_per_piece / fabric_cost - 1) * 100) if (cost_per_piece and fabric_cost) else None

        record.total_fabric_required = total_fabric
        record.yield_value = yield_val
        record.fabric_utilization = fabric_util
        record.cost_per_piece = cost_per_piece
        record.estimated_margin_impact = margin_impact
    except Exception:
        pass


def save_mini_marker_service(rfq_id: int, payload: MiniMarkerSave, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    record = db.query(MiniMarker).filter(MiniMarker.rfq_id == rfq_id).first()

    if not record:
        record = MiniMarker(rfq_id=rfq_id)
        db.add(record)

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(record, field, value)

    if record.status == ProductDevStatus.NOT_STARTED and any([
        record.fabric_width, record.gsm, record.consumption
    ]):
        record.status = ProductDevStatus.IN_PROGRESS

    _calculate_fields(record)
    db.commit()
    db.refresh(record)
    return record
