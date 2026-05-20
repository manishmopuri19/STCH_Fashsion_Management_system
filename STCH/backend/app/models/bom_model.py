from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.sql import func
from app.db.database import Base
from app.enums.product_dev_enums import ProductDevStatus
from sqlalchemy.orm import relationship


class BOM(Base):
    __tablename__ = "boms"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, unique=True)
    status = Column(Enum(ProductDevStatus), default=ProductDevStatus.NOT_STARTED)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    rfq = relationship("RFQ", back_populates="bom")
    items = relationship("BOMItem", back_populates="bom", cascade="all, delete")


class BOMItem(Base):
    __tablename__ = "bom_items"

    id = Column(Integer, primary_key=True, index=True)
    bom_id = Column(Integer, ForeignKey("boms.id", ondelete="CASCADE"), nullable=False)
    material = Column(String, nullable=False)
    material_type = Column(String, nullable=True)   # Fabric, Trim, Accessory, etc.
    consumption = Column(Float, nullable=True)
    unit = Column(String, nullable=True)             # meters, pcs, kg, etc.
    cost = Column(Float, nullable=True)
    supplier = Column(String, nullable=True)
    remarks = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

    bom = relationship("BOM", back_populates="items")
