from typing import Optional

from pydantic import BaseModel
from app.enums.user_enums import UserRole
class newUser(BaseModel):
    userName:str
    email: str
    password: str
    role: Optional[UserRole] = UserRole.MEMBER

