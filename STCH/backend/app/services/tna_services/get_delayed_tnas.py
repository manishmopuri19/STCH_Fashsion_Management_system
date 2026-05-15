from datetime import date

from sqlalchemy.orm import Session

from app.models.Tna_model import TNA

from app.enums.TNAStatus_enums import (
    TNAStatus
)


def get_delayed_tnas_service(
    db: Session
):

    delayed = db.query(TNA).filter(

        TNA.planned_date < date.today(),

        TNA.status != TNAStatus.COMPLETED

    ).all()

    return delayed