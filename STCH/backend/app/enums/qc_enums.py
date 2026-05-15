from enum import Enum


class QCStatus(str, Enum):

    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class QCResult(str, Enum):

    PENDING = "PENDING"
    PASSED = "PASSED"
    FAILED = "FAILED"
    CONDITIONAL_PASS = "CONDITIONAL_PASS"
    REJECTED = "REJECTED"

class QCInspectionType(str, Enum):

    INLINE = "INLINE"
    MIDLINE = "MIDLINE"
    FINAL = "FINAL"
    PRE_SHIPMENT = "PRE_SHIPMENT"

class QCDefectSeverity(str, Enum):

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"