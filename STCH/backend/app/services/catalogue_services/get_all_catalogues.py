from sqlalchemy.orm import Session

from app.models.catalogue_model import Catalogue


def get_all_catalogues_service(
    db: Session
):

    catalogues = db.query(
        Catalogue
    ).all()

    return catalogues