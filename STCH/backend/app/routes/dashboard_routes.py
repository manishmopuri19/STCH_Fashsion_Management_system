from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.core.permissions import (
    get_current_user
)

from app.enums.user_enums import (
    UserRole
)

from app.services.dashboard_services.admin_dashboard import (
    get_admin_dashboard_service
)

from app.services.dashboard_services.merch_dashboard import (
    get_merch_dashboard_service
)

from app.services.dashboard_services.supplier_dashboard import (
    get_supplier_dashboard_service
)

from app.services.dashboard_services.member_dashboard import (
    get_member_dashboard_service
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/")
def get_dashboard(

    db: Session = Depends(get_db),

    current_user=Depends(
        get_current_user
    )
):

    if current_user.role == UserRole.ADMIN:

        return get_admin_dashboard_service(
            db
        )

    elif current_user.role == UserRole.MERCHANDISER:

        return get_merch_dashboard_service(

            db,

            current_user
        )

    elif current_user.role == UserRole.SUPPLIER:

        return get_supplier_dashboard_service(

            db,

            current_user
        )

    elif current_user.role == UserRole.QC:
        return get_member_dashboard_service(db, current_user)

    # MEMBER and any other internal role
    return get_member_dashboard_service(db, current_user)