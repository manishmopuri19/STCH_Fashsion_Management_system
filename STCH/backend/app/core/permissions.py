from fastapi import Depends, HTTPException

from app.core.security import get_current_user
from app.enums.user_enums import UserRole

def require_roles(allowed_roles: list):

    def role_checker(current_user = Depends(get_current_user)):

        if current_user.role not in allowed_roles:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return current_user

    return role_checker