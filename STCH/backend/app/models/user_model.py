from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
)

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