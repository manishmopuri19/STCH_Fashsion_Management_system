from sqlalchemy import (Column, Integer,String,Float,Date, DateTime,Enum,ForeignKey)

from sqlalchemy.sql import func

from app.db.database import Base
from sqlalchemy.orm import relationship
from app.enums.POstatus_enums import (POStatus)


class PurchaseOrder(Base):

    __tablename__ = "purchase_orders"

    id = Column(
        Integer,
        primary_key=True
    )

    po_number = Column(
        String,
        unique=True,
        index=True
    )

    rfq_id = Column(
    Integer,
    ForeignKey(
        "rfqs.id",
        ondelete="CASCADE"
    )
    )

    supplier_id = Column(
    Integer,
    ForeignKey(
        "suppliers.id",
        ondelete="CASCADE"
    )
    )
    quantity = Column(Integer)

    target_price = Column(Float)

    supplier_price = Column(Float)

    margin = Column(Float)

    profitability = Column(Float)

    total_amount = Column(Float)

    currency = Column(String)

    delivery_date = Column(Date)

    lead_time = Column(Integer)

    payment_terms = Column(String)

    status = Column(
        Enum(POStatus),
        default=POStatus.CREATED
    )

    created_by = Column(Integer)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    supplier = relationship(
    "Supplier",
    back_populates="purchase_orders"
    )

    tnas = relationship(
    "TNA",
    back_populates="purchase_order",
    cascade="all, delete"
    )

    quality_inspections = relationship(
    "QualityInspection",
    back_populates="purchase_order",
    cascade="all, delete"
    )