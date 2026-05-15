from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.catalogue_model import Catalogue
from app.schemas.catalogue_schema import UpdateCatalogueSchema

def update_catalogue_service(
    catalogue_id: int,
    payload:UpdateCatalogueSchema,
    db: Session
):

    catalogue = db.query(
        Catalogue
    ).filter(
        Catalogue.id == catalogue_id
    ).first()

    if not catalogue:

        raise HTTPException(
            status_code=404,
            detail="Catalogue not found"
        )

    catalogue.product_name = (
        payload.product_name
    )

    catalogue.category = (
        payload.category
    )

    catalogue.garment_type = (
        payload.garment_type
    )

    catalogue.fabric_type = (
        payload.fabric_type
    )

    catalogue.fabric_composition = (
        payload.fabric_composition
    )

    catalogue.gsm = payload.gsm

    catalogue.wash_type = (
        payload.wash_type
    )

    catalogue.print_type = (
        payload.print_type
    )

    catalogue.embroidery_type = (
        payload.embroidery_type
    )

    catalogue.moq = payload.moq

    catalogue.target_price = (
        payload.target_price
    )

    catalogue.lead_time = (
        payload.lead_time
    )

    catalogue.image_url = (
        payload.image_url
    )

    catalogue.description = (
        payload.description
    )

    db.commit()

    db.refresh(catalogue)

    return {

        "message":
        "Catalogue updated successfully"
    }