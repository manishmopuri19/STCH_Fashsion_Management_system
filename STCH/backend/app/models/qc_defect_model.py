from sqlalchemy import JSON,Column,Date,DateTime,Float, ForeignKey,Integer,String,Text,Enum,Boolean
from sqlalchemy.sql import func
from app.db.database import Base
from app.enums.qc_enums import QCDefectSeverity
from sqlalchemy.orm import relationship

class QCDefect(Base):

    __tablename__ = "qc_defects"

    id = Column(
        Integer,
        primary_key=True
    )

    inspection_id = Column(
        Integer,
        ForeignKey(
            "quality_inspections.id",
            ondelete="CASCADE"
        )
    )

    defect_type = Column(Text)

    defect_count = Column(Integer)

    severity = Column(
        Enum(QCDefectSeverity)
    )

    remarks = Column(Text)

    inspection = relationship(
    "QualityInspection",
    back_populates="defects"
    )