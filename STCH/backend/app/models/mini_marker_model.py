from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.sql import func
from app.db.database import Base
from app.enums.product_dev_enums import ProductDevStatus
from sqlalchemy.orm import relationship


class MiniMarker(Base):
    __tablename__ = "mini_markers"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False, unique=True)

    # INPUTS
    fabric_width = Column(Float, nullable=True)        # cm
    gsm = Column(Float, nullable=True)                 # grams per m²
    size_ratio = Column(String, nullable=True)         # e.g. "S:M:L:XL = 1:2:2:1"
    marker_efficiency = Column(Float, nullable=True)   # percentage
    wastage_pct = Column(Float, nullable=True)         # percentage
    consumption = Column(Float, nullable=True)         # meters per piece
    cad_ratio = Column(Float, nullable=True)
    fabric_cost = Column(Float, nullable=True)         # cost per meter

    # UPLOADS
    cad_file_url = Column(Text, nullable=True)
    marker_image_url = Column(Text, nullable=True)

    # CALCULATED (cached)
    total_fabric_required = Column(Float, nullable=True)
    yield_value = Column(Float, nullable=True)
    fabric_utilization = Column(Float, nullable=True)
    cost_per_piece = Column(Float, nullable=True)
    estimated_margin_impact = Column(Float, nullable=True)

    status = Column(Enum(ProductDevStatus), default=ProductDevStatus.NOT_STARTED)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    rfq = relationship("RFQ", back_populates="mini_marker")
