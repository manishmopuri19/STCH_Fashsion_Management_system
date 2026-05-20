from enum import Enum


class ProductDevStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    APPROVED = "APPROVED"


class SampleType(str, Enum):
    PROTO = "PROTO"
    FIT = "FIT"
    PP = "PP"
    SIZE_SET = "SIZE_SET"
    SHIPMENT = "SHIPMENT"


class SampleStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
