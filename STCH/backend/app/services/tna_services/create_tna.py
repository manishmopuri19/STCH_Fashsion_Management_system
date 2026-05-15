from app.models.Tna_model import TNA
from sqlalchemy.orm import Session
from app.enums.TNAStatus_enums import (
    TNAStatus
)
from app.schemas.tna_schema import CreateTNASchema


def create_tna_service(

    po_id: int,

    payload:CreateTNASchema,

    db:Session
):

    tna = TNA(

        po_id=po_id,

        activity_type=
        payload.activity_type,

        assigned_to=
        payload.assigned_to,

        priority=
        payload.priority,

        planned_date=
        payload.planned_date,

        remarks=
        payload.remarks,

        status=TNAStatus.PENDING
    )

    db.add(tna)

    db.commit()

    db.refresh(tna)

    return {

        "message":
        "TNA created successfully"
    }