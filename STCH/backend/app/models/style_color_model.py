from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class StyleColor(Base):

    __tablename__ = "style_colors"

    id = Column(Integer, primary_key=True)

    style_id = Column(
        Integer,
        ForeignKey("po_styles.id", ondelete="CASCADE")
    )

    color_name = Column(String, nullable=False)

    color_code = Column(String, unique=True, index=True)

    hex_value = Column(String, nullable=True)

    fabric_image_path = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    style = relationship(
        "POStyle",
        back_populates="colors"
    )

    sizes = relationship(
        "ColorSize",
        back_populates="color",
        cascade="all, delete"
    )
