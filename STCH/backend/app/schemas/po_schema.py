from pydantic import BaseModel


class ConvertRFQToPOSchema(BaseModel):
    rfq_supplier_id: int
    