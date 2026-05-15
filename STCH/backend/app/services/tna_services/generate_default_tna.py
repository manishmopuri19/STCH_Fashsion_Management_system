from datetime import date, timedelta

from app.models.Tna_model import TNA
from sqlalchemy.orm import Session
from app.enums.TNAStatus_enums import (
    TNAStatus,
    TNAActivityType
)


def generate_default_tna_service(
    po_id,
    db:Session
):

    today = date.today()

    activities = [

        (
            TNAActivityType.FABRIC_BOOKING,
            3
        ),

        (
            TNAActivityType.PP_SAMPLE,
            7
        ),

        (
            TNAActivityType.CUTTING_START,
            14
        ),

        (
            TNAActivityType.INLINE_INSPECTION,
            25
        ),

        (
            TNAActivityType.FINAL_INSPECTION,
            40
        ),

        (
            TNAActivityType.DISPATCH,
            50
        ),
    ]

    for activity, days in activities:

        tna = TNA(

            po_id=po_id,

            activity_type=activity,

            planned_date=
            today + timedelta(days=days),

            status=TNAStatus.PENDING
        )

        db.add(tna)

    db.commit()