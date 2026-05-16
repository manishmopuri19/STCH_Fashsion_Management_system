from typing import Optional
from pydantic import BaseModel
from app.enums.user_enums import UserRole
class NewUser(BaseModel):
    userName:str
    email: str
    password: str
    role: Optional[UserRole] = UserRole.MEMBER


class UpdateUser(BaseModel):
    userName: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None