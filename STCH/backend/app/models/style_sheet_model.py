from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.sql import func
from app.db.database import Base
from app.enums.product_dev_enums import ProductDevStatus
from sqlalchemy.orm import relationship


class StyleSheet(Base):
    __tablename__ = "style_sheets"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, unique=True)

    front_image_url = Column(Text, nullable=True)
    back_image_url = Column(Text, nullable=True)
    fabric_details = Column(Text, nullable=True)
    wash_details = Column(Text, nullable=True)
    stitch_details = Column(Text, nullable=True)
    fit_type = Column(String, nullable=True)
    label_placement = Column(Text, nullable=True)
    artwork_notes = Column(Text, nullable=True)
    packaging_notes = Column(Text, nullable=True)

    status = Column(Enum(ProductDevStatus), default=ProductDevStatus.NOT_STARTED)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    rfq = relationship("RFQ", back_populates="style_sheet")
