from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.enums.TNAStatus_enums import (TNAStatus,TNAActivityType,TNAPriority)


class CreateTNASchema(BaseModel):
    activity_type: TNAActivityType
    assigned_to: Optional[int] = None
    priority: Optional[TNAPriority]=None
    planned_date:date
    remarks: Optional[str] = None


class UpdateTNASchema(BaseModel):

    assigned_to: Optional[int] = None
    priority: TNAPriority
    planned_date: date
    actual_date: Optional[date] = None
    remarks: Optional[str] = None


class UpdateTNAStatusSchema(BaseModel):

    status: TNAStatus