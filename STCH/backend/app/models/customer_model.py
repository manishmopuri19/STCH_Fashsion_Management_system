from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String, nullable=False, index=True)

    contact_person = Column(String, nullable=False)

    email = Column(String, unique=True, index=True)

    phone = Column(String)

    country = Column(String)

    address = Column(Text)

    currency = Column(String, default="USD")

    payment_terms = Column(String)

    notes = Column(Text)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    rfqs = relationship(
        "RFQ",
        back_populates="customer"
    )
