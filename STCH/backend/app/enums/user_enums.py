from enum import Enum


class UserRole(str, Enum):

    ADMIN = "ADMIN"

    MEMBER = "MEMBER"

    MERCHANDISER = "MERCHANDISER"

    SUPPLIER="SUPPLIER"