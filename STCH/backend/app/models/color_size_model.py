from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class ColorSize(Base):

    __tablename__ = "color_sizes"

    id = Column(Integer, primary_key=True)

    color_id = Column(
        Integer,
        ForeignKey("style_colors.id", ondelete="CASCADE")
    )

    size_value = Column(String, nullable=False)

    size_code = Column(String, unique=True, index=True)

    quantity = Column(Integer, nullable=False, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    color = relationship(
        "StyleColor",
        back_populates="sizes"
    )
