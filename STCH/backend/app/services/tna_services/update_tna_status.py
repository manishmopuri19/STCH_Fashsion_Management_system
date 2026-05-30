from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.enums.user_enums import UserRole


def update_tna_status_service(tna_id: int, status, delayed_reason, current_user, db: Session):
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

    tna.status = status
    if delayed_reason is not None:
        tna.delayed_reason = delayed_reason

    db.commit()
    db.refresh(tna)

    return {"message": "TNA status updated"}
