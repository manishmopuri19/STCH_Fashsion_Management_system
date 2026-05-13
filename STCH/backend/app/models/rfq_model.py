from sqlalchemy import JSON, Column, Date, DateTime, Float, Integer, String, Text

from app.db.database import Base
from sqlalchemy import Enum

from app.enums.rfq_enums import RFQPriority, RFQStatus

class RFQ(Base):

    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True)

    rfq_number = Column(String, unique=True)

    # CLIENT
    brand = Column(String)
    season = Column(String)
    department = Column(String)
    category = Column(String)
    sub_category = Column(String)
    priority = Column(Enum(RFQPriority))

    # PRODUCT
    garment_type = Column(String)
    fabric_type = Column(String)
    fabric_weight = Column(String)
    fabric_composition = Column(String)
    construction = Column(String)
    yarn_count = Column(String)

    # ORDER
    quantity = Column(Integer)
    target_price = Column(Float)
    currency = Column(String)
    delivery_date = Column(Date)
    incoterms = Column(String)

    # TRIMS
    trims_details = Column(Text)
    packaging_type = Column(String)
    label_type = Column(String)

    # PROCESSING
    garment_wash = Column(JSON)
    dye_type = Column(String)
    print_type = Column(String)
    embroidery_type = Column(String)
    special_finish = Column(String)

    # COMPLIANCE
    compliance_standards = Column(JSON)
    testing_required = Column(JSON)
    social_compliance = Column(String)
    quality_standards = Column(String)

    # FILES
    tech_pack_url = Column(Text)
    reference_images = Column(Text)

    # NOTES
    notes = Column(Text)

    # PIPELINE
    status = Column(
    Enum(RFQStatus),
    default=RFQStatus.NEW
)


    # META
    created_by = Column(Integer)
    assigned_to = Column(Integer)

    created_at = Column(DateTime)
    updated_at = Column(DateTime)