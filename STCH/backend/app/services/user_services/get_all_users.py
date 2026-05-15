from sqlalchemy.orm import Session
from app.models.user_model import User

def getAllUsers(db:Session):
    
    users=db.query(User).all()
    return users