from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.enums.TNAStatus_enums import (TNAStatus,TNAActivityType,TNAPriority)


class CreateTNASchema(BaseModel):
    activity_type: TNAActivityType
    assigned_to: Optional[int] = None
    priority: Optional[TNAPriority] = None
    planned_date: date
    remarks: Optional[str] = None
    style_id: Optional[int] = None


class UpdateTNASchema(BaseModel):
    assigned_to: Optional[int] = None
    priority: Optional[TNAPriority] = None
    planned_date: Optional[date] = None
    actual_date: Optional[date] = None
    remarks: Optional[str] = None
    delayed_reason: Optional[str] = None


class UpdateTNAStatusSchema(BaseModel):
    status: TNAStatus
    delayed_reason: Optional[str] = None


class UpdateTNAAssignedSchema(BaseModel):
    """For assigned (non-merchandiser) users — status + delayed reason only."""
    status: TNAStatus
    delayed_reason: Optional[str] = None