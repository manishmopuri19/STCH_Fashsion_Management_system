from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    DateTime,
)

from sqlalchemy.sql import func

from app.db.database import Base


class Supplier(Base):

    __tablename__ = "suppliers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        unique=True
    )



    company_name = Column(
        String,
        nullable=False
    )

    contact_person = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True
    )

    phone = Column(String)

    city = Column(String)

    country = Column(String)

    specialization = Column(Text)

    minimum_order_quantity = Column(
        Integer
    )

    lead_time = Column(Integer)

    address = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )