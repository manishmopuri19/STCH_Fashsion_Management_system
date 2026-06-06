from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import date

from app.enums.qc_enums import (QCInspectionType,QCStatus,QCResult,QCDefectSeverity)


class CreateInspectionSchema(BaseModel):

    inspection_type: QCInspectionType
    assigned_to: Optional[int] = None
    inspection_date: Optional[date] = None
    aql_level: Optional[str] = None
    total_checked: Optional[int] = None
    passed_quantity: Optional[int] = None
    failed_quantity: Optional[int] = None
    remarks: Optional[str] = None


class UpdateInspectionStatusSchema(BaseModel):

    status: QCStatus
    result: QCResult


class SubmitInspectionSchema(BaseModel):

    inspection_date: date
    aql_level: str
    total_checked: int
    passed_quantity: int
    failed_quantity: int
    result: QCResult
    remarks: Optional[str] = None

    @model_validator(mode="after")
    def check_quantities(self):
        if self.passed_quantity + self.failed_quantity != self.total_checked:
            raise ValueError(
                "passed_quantity + failed_quantity must equal total_checked"
            )
        return self


class CreateDefectSchema(BaseModel):

    defect_type: str
    defect_count: int
    severity: QCDefectSeverity
    remarks: Optional[str] = None