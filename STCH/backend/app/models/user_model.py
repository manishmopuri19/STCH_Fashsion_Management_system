from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    Text,
)
from sqlalchemy.orm import relationship
from app.db.database import Base

from app.enums.user_enums import (
    UserRole
)


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    userName =Column(
        String,
        index=True

    )
    email = Column(
        String,
        unique=True,
        index=True
    )

    password = Column(String)

    role = Column(
        Enum(UserRole),
        nullable=False
    )

    phone = Column(String, nullable=True)

    department = Column(String, nullable=True)

    designation = Column(String, nullable=True)

    supplier = relationship(
    "Supplier",
    back_populates="user",
    cascade="all, delete"
    )

    created_rfqs = relationship(
    "RFQ",
    foreign_keys="[RFQ.created_by]"
    )

    assigned_rfqs = relationship(
    "RFQ",
    foreign_keys="[RFQ.assigned_to]"
    )

    tna_tasks = relationship(
    "TNA",
    back_populates="assigned_user"
    )