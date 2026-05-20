from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.enums.product_dev_enums import SampleType, SampleStatus


class SamplingRecordSave(BaseModel):
    sample_type: SampleType
    status: Optional[SampleStatus] = None
    comments: Optional[str] = None
    file_url: Optional[str] = None
    submitted_date: Optional[date] = None
    approved_date: Optional[date] = None


class SamplingStatusUpdate(BaseModel):
    status: SampleStatus
