from sqlalchemy import Column, Integer, ForeignKey
from app.db.database import Base

class RFQCollaborator(Base):
    __tablename__ = "rfq_collaborators"

    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))