from sqlalchemy.orm import Session
from app.models.user_model import User


def get_internal_users_service(db: Session):
    """Returns all users for the TNA assigned-to dropdown."""
    users = (
        db.query(User)
        .order_by(User.userName)
        .all()
    )

    return [
        {
            "id": u.id,
            "name": u.userName,
            "role": u.role.value,
            "email": u.email,
        }
        for u in users
    ]
