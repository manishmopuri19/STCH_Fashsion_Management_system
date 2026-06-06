from sqlalchemy.orm import Session, joinedload
from app.models.bom_model import BOM
from app.utils.rfq_permissions import can_access_rfq


async def get_bom_service(rfq_id: int, db: Session, current_user):
    can_access_rfq(rfq_id, current_user, db)
    record = await db.query(BOM).options(
        joinedload(BOM.items)
    ).filter(BOM.rfq_id == rfq_id).first()
    if not record:
        return {"rfq_id": rfq_id, "status": "NOT_STARTED", "items": []}
    return {
        "id": record.id,
        "rfq_id": record.rfq_id,
        "status": record.status,
        "created_at": record.created_at,
        "updated_at": record.updated_at,
        "items": [
            {
                "id": item.id,
                "bom_id": item.bom_id,
                "material": item.material,
                "material_type": item.material_type,
                "consumption": item.consumption,
                "unit": item.unit,
                "cost": item.cost,
                "supplier": item.supplier,
                "remarks": item.remarks,
                "sort_order": item.sort_order,
            }
            for item in sorted(record.items, key=lambda x: x.sort_order or 0)
        ]
    }
