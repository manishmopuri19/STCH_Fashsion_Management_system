from app.models.qc_defect_model import QCDefect
from sqlalchemy.orm import Session
from app.schemas.qc_schema import CreateDefectSchema

def add_defect_service(
    inspection_id: int,
    payload:CreateDefectSchema,
    db:Session
):

    defect = QCDefect(

        inspection_id=
        inspection_id,

        defect_type=
        payload.defect_type,

        defect_count=
        payload.defect_count,

        severity=
        payload.severity,

        remarks=
        payload.remarks
    )

    db.add(defect)

    db.commit()

    db.refresh(defect)

    return {

        "message":
        "Defect added successfully"
    }