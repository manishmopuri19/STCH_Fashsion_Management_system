from sqlalchemy import JSON,Column,Date,DateTime,Float, ForeignKey,Integer,String,Text,Enum,Boolean
from sqlalchemy.sql import func
from app.db.database import Base


from app.db.database import Base
from app.enums.rfq_supplier_enums import RFQSupplierStatus


class RFQSupplier(Base):

    __tablename__ = "rfq_suppliers"

    id = Column(Integer, primary_key=True)

    rfq_id = Column(
        Integer,
        ForeignKey("rfqs.id", ondelete="CASCADE")
    )

    supplier_id = Column(
        Integer,
        ForeignKey("suppliers.id", ondelete="CASCADE")
    )

    supplier_target_price = Column(Float)

    quoted_price = Column(Float)
    moq = Column(Integer)

    lead_time = Column(Integer)

    payment_terms = Column(String)

    remarks = Column(Text)

    status = Column(
        Enum(RFQSupplierStatus),
        default=RFQSupplierStatus.MATCHED
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )