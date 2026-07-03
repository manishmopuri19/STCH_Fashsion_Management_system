from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.Tna_model import TNA
from app.enums.user_enums import UserRole
from app.enums.TNAStatus_enums import TNAActivityType, TNAStatus, TNA_WORKFLOW_ORDER


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

    # Enforce strict sequential workflow for style-level TNAs
    if tna.style_id:
        try:
            act = TNAActivityType(tna.activity_type)
            step_index = TNA_WORKFLOW_ORDER.index(act)
        except (ValueError, KeyError):
            # Not a workflow step — skip enforcement
            step_index = None

        if step_index is not None and status == TNAStatus.IN_PROGRESS:
            # Only one step may be IN_PROGRESS at a time
            other = db.query(TNA).filter(
                TNA.style_id == tna.style_id,
                TNA.id != tna_id,
                TNA.status == TNAStatus.IN_PROGRESS,
            ).first()
            if other:
                raise HTTPException(
                    status_code=400,
                    detail="Another step is already in progress. Complete it before starting a new one.",
                )

            # Previous step must be COMPLETED first
            if step_index > 0:
                prev_act = TNA_WORKFLOW_ORDER[step_index - 1]
                prev_tna = db.query(TNA).filter(
                    TNA.style_id == tna.style_id,
                    TNA.activity_type == prev_act,
                ).first()
                if not prev_tna or prev_tna.status != TNAStatus.COMPLETED:
                    prev_label = prev_act.value.replace("_", " ").title()
                    raise HTTPException(
                        status_code=400,
                        detail=f"'{prev_label}' must be completed before starting this step.",
                    )

    tna.status = status
    if delayed_reason is not None:
        tna.delayed_reason = delayed_reason

    db.commit()
    db.refresh(tna)

    return {"message": "TNA status updated"}
