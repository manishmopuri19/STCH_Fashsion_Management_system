from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.enums.qc_enums import (QCInspectionType,QCStatus,QCResult,QCDefectSeverity)


class CreateInspectionSchema(BaseModel):

    inspection_type: QCInspectionType
    inspection_date: date
    aql_level: str
    total_checked: int
    passed_quantity: int
    failed_quantity: int
    remarks: Optional[str] = None


class UpdateInspectionStatusSchema(BaseModel):

    status: QCStatus
    result: QCResult


class CreateDefectSchema(BaseModel):

    defect_type: str
    defect_count: int
    severity: QCDefectSeverity
    remarks: Optional[str] = None