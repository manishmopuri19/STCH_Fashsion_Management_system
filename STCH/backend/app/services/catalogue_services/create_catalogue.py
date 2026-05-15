from app.models.catalogue_model import Catalogue
from sqlalchemy.orm import Session
from app.schemas.catalogue_schema import CreateCatalogueSchema

def create_catalogue_service(payload:CreateCatalogueSchema,db:Session):

    catalogue = Catalogue(

        supplier_id=payload.supplier_id,

        product_name=payload.product_name,

        category=payload.category,

        garment_type=payload.garment_type,

        fabric_type=payload.fabric_type,

        fabric_composition=
        payload.fabric_composition,

        gsm=payload.gsm,

        wash_type=payload.wash_type,

        print_type=payload.print_type,

        embroidery_type=
        payload.embroidery_type,

        moq=payload.moq,

        target_price=
        payload.target_price,

        lead_time=
        payload.lead_time,

        image_url=
        payload.image_url,

        description=
        payload.description
    )

    db.add(catalogue)

    db.commit()

    db.refresh(catalogue)

    return {

        "message":
        "Catalogue created successfully"
    }