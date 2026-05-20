from sqlalchemy import JSON, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, Enum, Boolean
from sqlalchemy.sql import func
from app.db.database import Base
from app.enums.rfq_enums import RFQPriority, RFQStatus
from sqlalchemy.orm import relationship
class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True, index=True)
    rfq_number = Column(String, unique=True, index=True)

    # BRAND INFO (Step 1)
    brand = Column(String, nullable=False)
    season = Column(String, nullable=False)
    department = Column(String, nullable=False)
    category = Column(String, nullable=True)
    sub_category = Column(String, nullable=True)
    priority = Column(Enum(RFQPriority), nullable=False)

    # GARMENT DETAILS (Step 2)
    garment_type = Column(String, nullable=False)
    fabric_type = Column(String, nullable=False)
    fabric_weight = Column(String, nullable=False) # Store as string to handle units/GSM
    fabric_composition = Column(String, nullable=False)
    construction = Column(String, nullable=True)
    yarn_count = Column(String, nullable=True)

    # ORDER DETAILS (Step 3)
    quantity = Column(Integer, nullable=False)
    target_price = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    delivery_date = Column(Date, nullable=False)
    incoterms = Column(String, nullable=False)

    # TRIMS & ACCESSORIES (Step 4)
    trims_details = Column(Text, nullable=False)
    packaging_type = Column(String, nullable=False)
    label_type = Column(String, nullable=False)

    # WASH & FINISH (Step 5)
    garment_wash = Column(JSON, default=[]) # Coming from Chips
    dye_type = Column(String, nullable=True)
    print_type = Column(String, nullable=True)
    embroidery_type = Column(String, nullable=True)
    special_finish = Column(String, nullable=True)

    # COMPLIANCE (Step 6)
    compliance_standards = Column(JSON, default=[]) # Coming from Chips
    testing_required = Column(JSON, default=[])     # Coming from Chips
    social_compliance = Column(String, nullable=True)
    quality_standards = Column(String, nullable=True)

    # ADDITIONAL INFO & FILES (Step 7)
    tech_pack_url = Column(Text, nullable=True)
    reference_images = Column(Text, nullable=True) # Stored as newline string from TextArea
    notes = Column(Text, nullable=True)

    # PIPELINE & STATUS
    status = Column(Enum(RFQStatus), default=RFQStatus.NEW)
    is_new = Column(Boolean, default=True) # New flag to track unread RFQs

    # META
    created_by = Column(

    Integer,

    ForeignKey("users.id"),

    nullable=True
    )

    assigned_to = Column(

    Integer,

    ForeignKey("users.id"),

    nullable=True
)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    suppliers = relationship(
    "RFQSupplier",
    back_populates="rfq",
    cascade="all, delete"
    )

    collaborators = relationship(
    "RFQCollaborator",
    back_populates="rfq",
    cascade="all, delete"
    )

    mini_marker = relationship(
    "MiniMarker",
    back_populates="rfq",
    cascade="all, delete",
    uselist=False
    )

    bom = relationship(
    "BOM",
    back_populates="rfq",
    cascade="all, delete",
    uselist=False
    )

    style_sheet = relationship(
    "StyleSheet",
    back_populates="rfq",
    cascade="all, delete",
    uselist=False
    )

    sampling_records = relationship(
    "SamplingRecord",
    back_populates="rfq",
    cascade="all, delete"
    )