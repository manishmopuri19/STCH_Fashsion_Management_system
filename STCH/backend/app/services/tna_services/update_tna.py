from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.models.purchaseOrder_model import PurchaseOrder
from app.models.rfqCollaborator_model import RFQCollaborator
from app.schemas.tna_schema import UpdateTNASchema
from app.enums.user_enums import UserRole


def _auto_add_collaborator(tna: TNA, user_id: int, db: Session):
    """Add the assigned user as an RFQ collaborator if not already one."""
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == tna.po_id).first()
    if not po:
        return
    existing = db.query(RFQCollaborator).filter(
        RFQCollaborator.rfq_id == po.rfq_id,
        RFQCollaborator.user_id == user_id,
    ).first()
    if not existing:
        db.add(RFQCollaborator(rfq_id=po.rfq_id, user_id=user_id))


def update_tna_service(tna_id: int, payload: UpdateTNASchema, current_user, db: Session):
    tna = db.query(TNA).filter(TNA.id == tna_id).first()

    if not tna:
        raise HTTPException(status_code=404, detail="TNA not found")

    is_privileged = current_user.role in [UserRole.ADMIN, UserRole.MERCHANDISER]
    is_assigned = tna.assigned_to == current_user.id

    if not is_privileged and not is_assigned:
        raise HTTPException(
            status_code=403,
            detail="You can only update TNA records assigned to you"
        )

    if is_privileged:
        if payload.assigned_to is not None and payload.assigned_to != tna.assigned_to:
            tna.assigned_to = payload.assigned_to
            _auto_add_collaborator(tna, payload.assigned_to, db)
        if payload.priority is not None:
            tna.priority = payload.priority
        if payload.planned_date is not None:
            po = db.query(PurchaseOrder).filter(PurchaseOrder.id == tna.po_id).first()
            if po and po.delivery_date and payload.planned_date > po.delivery_date:
                raise HTTPException(
                    status_code=400,
                    detail=f"Planned date cannot be after the delivery date ({po.delivery_date}).",
                )
            tna.planned_date = payload.planned_date
        if payload.actual_date is not None:
            tna.actual_date = payload.actual_date
        if payload.remarks is not None:
            tna.remarks = payload.remarks
        if payload.delayed_reason is not None:
            tna.delayed_reason = payload.delayed_reason
    else:
        if payload.delayed_reason is not None:
            tna.delayed_reason = payload.delayed_reason

    db.commit()
    db.refresh(tna)

    return {"message": "TNA updated successfully"}
