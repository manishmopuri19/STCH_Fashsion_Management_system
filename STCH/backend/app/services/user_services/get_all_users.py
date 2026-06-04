from sqlalchemy.orm import Session
from app.models.user_model import User

def getAllUsers(db: Session):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "userName": u.userName,
            "email": u.email,
            "role": u.role.value,
        }
        for u in users
    ]