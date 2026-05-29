from sqlalchemy import ( Column, Integer, String, Float, Text, DateTime, ForeignKey)

from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy.orm import relationship

class Catalogue(Base):

    __tablename__ = "catalogues"

    id = Column(
        Integer,
        primary_key=True
    )

    supplier_id = Column(
        Integer,
        ForeignKey(
            "suppliers.id",
            ondelete="CASCADE"
        ),
        nullable=True
    )

    product_name = Column(String)
    category = Column(String)
    garment_type = Column(String)
    fabric_type = Column(String)
    fabric_composition = Column(String)
    gsm = Column(String)
    wash_type = Column(String)
    print_type = Column(String)
    embroidery_type = Column(String)
    moq = Column(Integer)
    target_price = Column(Float)
    lead_time = Column(Integer)
    image_url = Column(Text)
    description = Column(Text)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
    supplier = relationship(
    "Supplier",
    back_populates="catalogues"
    )