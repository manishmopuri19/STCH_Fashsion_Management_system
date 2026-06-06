from typing import Optional
from pydantic import BaseModel
from app.enums.user_enums import UserRole


class NewUser(BaseModel):
    userName: str
    email: str
    password: str
    role: Optional[UserRole] = UserRole.MEMBER
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None


class UpdateUser(BaseModel):
    userName: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None