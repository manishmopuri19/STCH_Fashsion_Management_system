from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.services.collaboration_services.add_collaboration import (
    add_collaborator_service
)

from app.services.collaboration_services.get_collaborators import (
    get_collaborators_service
)

from app.services.collaboration_services.remove_collaborator import (
    remove_collaborator_service
)
from fastapi import HTTPException
from app.core.security import get_current_user
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole
from app.models.rfq_model import RFQ

router = APIRouter(
    prefix="/collaborations",
    tags=["Collaborations"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/{rfq_id}/{user_id}")
def add_collaborator(

    rfq_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    if current_user.role == UserRole.MERCHANDISER:
        rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")
        if rfq.created_by != current_user.id:
            raise HTTPException(status_code=403, detail="You can only manage collaborators on your own RFQs")

    return add_collaborator_service(
        rfq_id,
        user_id,
        db
    )


@router.get("/{rfq_id}")
def get_collaborators(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return get_collaborators_service(
        rfq_id,
        db
    )


@router.delete("/{rfq_id}/{user_id}")
def remove_collaborator(
    rfq_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    if current_user.role == UserRole.MERCHANDISER:
        rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")
        if rfq.created_by != current_user.id:
            raise HTTPException(status_code=403, detail="You can only manage collaborators on your own RFQs")

    return remove_collaborator_service(
        rfq_id,
        user_id,
        db
    )