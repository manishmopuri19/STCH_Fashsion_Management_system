from sqlalchemy.orm import Session

from app.models.supplier_model import (
    Supplier
)


def get_all_suppliers_service(
    db: Session
):

    return db.query(
        Supplier
    ).all()