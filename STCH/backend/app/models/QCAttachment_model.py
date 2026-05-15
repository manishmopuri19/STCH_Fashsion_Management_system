from sqlalchemy import JSON,Column,Date,DateTime,Float, ForeignKey,Integer,String,Text,Enum,Boolean
from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy import JSON,Column,Date,DateTime,Float,Integer,String,Text,Enum,Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class QCAttachment(Base):

    __tablename__ = "qc_attachments"

    id = Column(Integer, primary_key=True)

    inspection_id = Column(
        Integer,
        ForeignKey(
            "quality_inspections.id",
            ondelete="CASCADE"
        )
    )

    file_url = Column(Text)

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )