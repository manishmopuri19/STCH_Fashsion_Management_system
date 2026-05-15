from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.catalogue_model import Catalogue



def delete_catalogue_service(
    catalogue_id: int,
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

    db.delete(catalogue)

    db.commit()

    return {

        "message":
        "Catalogue deleted successfully"
    }