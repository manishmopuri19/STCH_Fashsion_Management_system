from sqlalchemy import JSON,Column,Date,DateTime,Float, ForeignKey,Integer,String,Text,Enum,Boolean
from sqlalchemy.sql import func
from app.db.database import Base

from app.enums.TNAStatus_enums import (
    TNAStatus,
    TNAActivityType,
    TNAPriority
)



class TNA(Base):

    __tablename__ = "tnas"

    id = Column(
        Integer,
        primary_key=True
    )

    po_id = Column(
        Integer,
        ForeignKey(
            "purchase_orders.id",
            ondelete="CASCADE"
        )
    )

    activity_type = Column(
        Enum(TNAActivityType),
        nullable=False
    )

    assigned_to = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    priority = Column(
        Enum(TNAPriority),
        default=TNAPriority.MEDIUM
    )

    planned_date = Column(
        Date,
        nullable=False
    )

    actual_date = Column(
        Date,
        nullable=True
    )

    status = Column(
        Enum(TNAStatus),
        default=TNAStatus.PENDING
    )

    remarks = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )