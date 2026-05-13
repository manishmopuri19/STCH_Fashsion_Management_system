from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.rfq_service import get_rfq_by_id
from app.db.database import SessionLocal
from app.models.rfq_model import RFQ
from app.models.rfqCollaborator_model import RFQCollaborator
from app.schemas.rfq_schema import RFQCreate, CollaboratorRequest, RFQResponse
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_rfq(
    rfq_in: RFQCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER]))
):
    # .model_dump() ensures only valid RFQ fields are passed to the model
    new_rfq = RFQ(**rfq_in.model_dump())
    new_rfq.created_by = current_user.id
    
    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)
    return {"message": "RFQ created successfully", "rfq_id": new_rfq.id}

@router.post("/{rfq_id}/collaborators")
def add_collaborator(
    rfq_id: int,
    collab_in: CollaboratorRequest,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles([UserRole.ADMIN])) # Only Admin can add
):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    # Check if collaborator is already added
    exists = db.query(RFQCollaborator).filter(
        RFQCollaborator.rfq_id == rfq_id, 
        RFQCollaborator.user_id == collab_in.user_id
    ).first()
    
    if exists:
        raise HTTPException(status_code=400, detail="User is already a collaborator")

    new_collab = RFQCollaborator(rfq_id=rfq_id, user_id=collab_in.user_id)
    db.add(new_collab)
    db.commit()
    return {"message": "Collaborator added successfully"}

@router.get("/getAllRfqs")
def get_all_rfqs(
    db: Session = Depends(get_db),
  current_user = Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER,UserRole.MEMBER]))  
):

    rfqs = db.query(RFQ).all()

    return rfqs


@router.get(
    "/rfq/{rfq_id}",
    response_model=RFQResponse
)
def fetch_single_rfq(
    rfq_id: int,
    db: Session = Depends(get_db),    
    current_user = Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER,UserRole.MEMBER]))  
):

    rfq = get_rfq_by_id(
        rfq_id,
        db
    )

    if not rfq:

        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    return rfq
