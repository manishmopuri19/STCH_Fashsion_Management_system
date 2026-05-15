from sqlalchemy.orm import Session

from datetime import datetime
from app.models.rfq_model import RFQ
from app.schemas.rfq_schema import RFQCreate
from app.enums.rfq_enums import RFQStatus


def generate_rfq_number():

    timestamp = datetime.now().strftime(
        "%Y%m%d%H%M%S"
    )

    return f"RFQ-{timestamp}"


def create_rfq_service(

    payload: RFQCreate,

    db: Session,

    current_user
):

    try:

        rfq = RFQ(

            rfq_number=generate_rfq_number(),

            brand=payload.brand,

            season=payload.season,

            department=payload.department,

            category=payload.category,

            sub_category=payload.sub_category,

            priority=payload.priority,

            garment_type=payload.garment_type,

            fabric_type=payload.fabric_type,

            fabric_weight=payload.fabric_weight,

            fabric_composition=payload.fabric_composition,

            construction=payload.construction,

            yarn_count=payload.yarn_count,

            quantity=payload.quantity,

            target_price=payload.target_price,

            currency=payload.currency,

            delivery_date=payload.delivery_date,

            incoterms=payload.incoterms,

            trims_details=payload.trims_details,

            packaging_type=payload.packaging_type,

            label_type=payload.label_type,

            garment_wash=payload.garment_wash,

            dye_type=payload.dye_type,

            print_type=payload.print_type,

            embroidery_type=payload.embroidery_type,

            special_finish=payload.special_finish,

            compliance_standards=payload.compliance_standards,

            testing_required=payload.testing_required,

            social_compliance=payload.social_compliance,

            quality_standards=payload.quality_standards,

            tech_pack_url=payload.tech_pack_url,

            reference_images=payload.reference_images,

            notes=payload.notes,

            status=RFQStatus.NEW,

            created_by=current_user.id
        )

        db.add(rfq)

        db.commit()

        db.refresh(rfq)

        return {

            "message":
            "RFQ created successfully",

            "rfq_id":
            rfq.id,

            "rfq_number":
            rfq.rfq_number
        }

    except Exception as e:

        db.rollback()

        raise e