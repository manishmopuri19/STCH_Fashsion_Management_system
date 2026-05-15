from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.supplier_model import (
    Supplier
)


def delete_supplier_service(

    supplier_id: int,

    db: Session
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    db.delete(supplier)

    db.commit()

    return {

        "message":
        "Supplier deleted successfully"
    }