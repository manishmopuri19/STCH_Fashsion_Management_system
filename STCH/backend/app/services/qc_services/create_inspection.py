from app.models.quality_inspection_model import QualityInspection
from app.enums.qc_enums import QCStatus,QCResult
from sqlalchemy.orm import Session
from app.schemas.qc_schema import CreateInspectionSchema


def create_inspection_service(

    po_id: int,
    payload:CreateInspectionSchema,
    db:Session,
    current_user):

    inspection = QualityInspection(

        po_id=po_id,

        inspection_type=
        payload.inspection_type,

        inspection_date=
        payload.inspection_date,

        inspected_by=
        current_user.id,

        assigned_to=
        payload.assigned_to,

        aql_level=
        payload.aql_level,

        total_checked=
        payload.total_checked,

        passed_quantity=
        payload.passed_quantity,

        failed_quantity=
        payload.failed_quantity,

        remarks=
        payload.remarks,

        status=QCStatus.PENDING,

        result=QCResult.PENDING
    )

    db.add(inspection)

    db.commit()

    db.refresh(inspection)

    return {

        "message":
        "Inspection created successfully",

        "inspection_id":
        inspection.id
    }