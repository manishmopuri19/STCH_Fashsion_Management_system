from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, Text, Enum
from sqlalchemy.sql import func
from app.db.database import Base
from app.enums.product_dev_enums import SampleType, SampleStatus
from sqlalchemy.orm import relationship


class SamplingRecord(Base):
    __tablename__ = "sampling_records"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id", ondelete="CASCADE"), nullable=False)
    sample_type = Column(Enum(SampleType), nullable=False)
    status = Column(Enum(SampleStatus), default=SampleStatus.NOT_STARTED)
    comments = Column(Text, nullable=True)
    file_url = Column(Text, nullable=True)
    submitted_date = Column(Date, nullable=True)
    approved_date = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    rfq = relationship("RFQ", back_populates="sampling_records")
