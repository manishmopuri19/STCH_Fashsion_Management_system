from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.supplier_model import Supplier
from app.schemas.supplier_schema import UpdateSupplierSchema

def update_supplier_service(supplier_id: int, payload: UpdateSupplierSchema, db: Session):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()

    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # Update only the fields provided in the payload
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(supplier, key, value)

    try:
        db.commit()  # Save changes to the database
        db.refresh(supplier)
        return supplier
    except Exception as e:
        db.rollback() # Release the database lock on failure
        raise HTTPException(status_code=500, detail=str(e))