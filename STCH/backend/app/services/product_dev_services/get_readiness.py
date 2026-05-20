from sqlalchemy.orm import Session
from app.models.mini_marker_model import MiniMarker
from app.models.bom_model import BOM
from app.models.style_sheet_model import StyleSheet
from app.models.sampling_model import SamplingRecord
from app.utils.rfq_permissions import can_access_rfq
from app.enums.product_dev_enums import ProductDevStatus, SampleStatus, SampleType


def get_readiness_service(rfq_id: int, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    mm = db.query(MiniMarker).filter(MiniMarker.rfq_id == rfq_id).first()
    bom = db.query(BOM).filter(BOM.rfq_id == rfq_id).first()
    ss = db.query(StyleSheet).filter(StyleSheet.rfq_id == rfq_id).first()
    pp_sample = db.query(SamplingRecord).filter(
        SamplingRecord.rfq_id == rfq_id,
        SamplingRecord.sample_type == SampleType.PP
    ).first()

    mm_status = mm.status if mm else ProductDevStatus.NOT_STARTED
    bom_status = bom.status if bom else ProductDevStatus.NOT_STARTED
    ss_status = ss.status if ss else ProductDevStatus.NOT_STARTED
    pp_status = pp_sample.status if pp_sample else SampleStatus.NOT_STARTED

    ready_states = {ProductDevStatus.COMPLETED, ProductDevStatus.APPROVED}

    mini_marker_ready = mm_status in ready_states
    bom_ready = bom_status in ready_states
    style_sheet_ready = ss_status in ready_states
    sampling_ready = pp_status == SampleStatus.APPROVED

    po_allowed = all([mini_marker_ready, bom_ready, style_sheet_ready, sampling_ready])

    return {
        "rfq_id": rfq_id,
        "mini_marker": {"status": mm_status, "ready": mini_marker_ready},
        "bom": {"status": bom_status, "ready": bom_ready},
        "style_sheet": {"status": ss_status, "ready": style_sheet_ready},
        "sampling": {"status": pp_status, "ready": sampling_ready},
        "po_allowed": po_allowed,
    }
