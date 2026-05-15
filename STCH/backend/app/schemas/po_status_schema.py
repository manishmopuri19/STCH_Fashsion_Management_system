from pydantic import BaseModel

from app.enums.POstatus_enums import (
    POStatus
)


class UpdatePOStatusSchema(BaseModel):
    status: POStatus