from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class POStyle(Base):

    __tablename__ = "po_styles"

    id = Column(Integer, primary_key=True)

    po_id = Column(
        Integer,
        ForeignKey("purchase_orders.id", ondelete="CASCADE")
    )

    style_name = Column(String, nullable=False)

    style_code = Column(String, unique=True, index=True)

    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    purchase_order = relationship(
        "PurchaseOrder",
        back_populates="styles"
    )

    colors = relationship(
        "StyleColor",
        back_populates="style",
        cascade="all, delete"
    )

    tnas = relationship(
        "TNA",
        back_populates="style",
        cascade="all, delete"
    )
