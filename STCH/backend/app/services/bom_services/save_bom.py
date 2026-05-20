from sqlalchemy.orm import Session
from app.models.bom_model import BOM, BOMItem
from app.schemas.bom_schema import BOMSave, BOMItemCreate, BOMItemUpdate
from app.utils.rfq_permissions import can_access_rfq
from app.enums.product_dev_enums import ProductDevStatus
from fastapi import HTTPException


def save_bom_service(rfq_id: int, payload: BOMSave, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    record = db.query(BOM).filter(BOM.rfq_id == rfq_id).first()
    if not record:
        record = BOM(rfq_id=rfq_id)
        db.add(record)
        db.flush()

    if payload.status is not None:
        record.status = payload.status

    if payload.items is not None:
        # Replace all items
        db.query(BOMItem).filter(BOMItem.bom_id == record.id).delete()
        for idx, item_data in enumerate(payload.items):
            item = BOMItem(
                bom_id=record.id,
                material=item_data.material,
                material_type=item_data.material_type,
                consumption=item_data.consumption,
                unit=item_data.unit,
                cost=item_data.cost,
                supplier=item_data.supplier,
                remarks=item_data.remarks,
                sort_order=item_data.sort_order if item_data.sort_order is not None else idx,
            )
            db.add(item)

    if record.status == ProductDevStatus.NOT_STARTED and payload.items:
        record.status = ProductDevStatus.IN_PROGRESS

    db.commit()
    db.refresh(record)
    return {"message": "BOM saved", "id": record.id, "status": record.status}


def add_bom_item_service(rfq_id: int, payload: BOMItemCreate, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)

    record = db.query(BOM).filter(BOM.rfq_id == rfq_id).first()
    if not record:
        record = BOM(rfq_id=rfq_id, status=ProductDevStatus.IN_PROGRESS)
        db.add(record)
        db.flush()

    item = BOMItem(
        bom_id=record.id,
        material=payload.material,
        material_type=payload.material_type,
        consumption=payload.consumption,
        unit=payload.unit,
        cost=payload.cost,
        supplier=payload.supplier,
        remarks=payload.remarks,
        sort_order=payload.sort_order or 0,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_bom_item_service(item_id: int, payload: BOMItemUpdate, db: Session, current_user):
    item = db.query(BOMItem).filter(BOMItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="BOM item not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_bom_item_service(item_id: int, db: Session, current_user):
    item = db.query(BOMItem).filter(BOMItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="BOM item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}
