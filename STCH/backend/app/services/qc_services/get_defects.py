from sqlalchemy.orm import Session

from app.models.qc_defect_model import QCDefect


def get_defects_service(

    inspection_id: int,

    db: Session
):

    defects = db.query(
        QCDefect
    ).filter(
        QCDefect.inspection_id
        == inspection_id
    ).all()

    return defects