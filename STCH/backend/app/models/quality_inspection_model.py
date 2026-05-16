from sqlalchemy import JSON,Column,Date,DateTime,Float, ForeignKey,Integer,String,Text,Enum,Boolean
from sqlalchemy.sql import func
from app.db.database import Base

from app.enums.qc_enums import (
    QCStatus,
    QCInspectionType,
    QCResult,
)
from sqlalchemy.orm import relationship


class QualityInspection(Base):

    __tablename__ = "quality_inspections"

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

    inspection_type = Column(
        Enum(QCInspectionType)
    )

    inspection_date = Column(Date)

    inspected_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    aql_level = Column(String)

    total_checked = Column(Integer)

    passed_quantity = Column(Integer)

    failed_quantity = Column(Integer)

    result = Column(
        Enum(QCResult),
        default=QCResult.PENDING
    )

    status = Column(
        Enum(QCStatus),
        default=QCStatus.PENDING
    )

    remarks = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    purchase_order = relationship(
    "PurchaseOrder",
    back_populates="quality_inspections"
    )

    defects = relationship(
    "QCDefect",
    back_populates="inspection",
    cascade="all, delete"
    )

    attachments = relationship(
    "QCAttachment",
    back_populates="inspection",
    cascade="all, delete"
    )