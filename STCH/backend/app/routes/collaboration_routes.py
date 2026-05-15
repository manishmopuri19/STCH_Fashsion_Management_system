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

    db: Session = Depends(get_db)
):

    return add_collaborator_service(
        rfq_id,
        user_id,
        db
    )


@router.get("/{rfq_id}")
def get_collaborators(

    rfq_id: int,

    db: Session = Depends(get_db)
):

    return get_collaborators_service(
        rfq_id,
        db
    )


@router.delete("/{rfq_id}/{user_id}")
def remove_collaborator(

    rfq_id: int,

    user_id: int,

    db: Session = Depends(get_db)
):

    return remove_collaborator_service(
        rfq_id,
        user_id,
        db
    )