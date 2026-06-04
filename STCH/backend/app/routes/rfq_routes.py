from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.responses import StreamingResponse
import io
import os
import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.rfq_schema import (RFQCreate,RFQStatusUpdate)
from app.services.rfq_services.create_rfq import (create_rfq_service)
from app.services.rfq_services.get_all_rfqs import (get_all_rfqs_service)
from app.services.rfq_services.get_single_rfq import (get_single_rfq_service)
from app.services.rfq_services.update_rfq_status import (update_rfq_status_service)
from app.services.rfq_services.delete_rfq import (delete_rfq_service)
from app.services.rfq_services.generate_pdf import generate_product_pdf
from app.core.permissions import (require_roles)

from app.enums.user_enums import (
    UserRole
)

router = APIRouter(
    prefix="/rfqs",
    tags=["RFQs"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/")
def get_all_rfqs(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER,
            UserRole.MEMBER,
        ])
    )
):

    return get_all_rfqs_service(db,current_user)


@router.get("/{rfq_id}")
def get_single_rfq(

    rfq_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.SUPPLIER,
            UserRole.MEMBER,
        ])
    )
):

    return get_single_rfq_service(
    rfq_id,
    db,
    current_user
    )


@router.post("/")
def create_rfq(

    payload: RFQCreate,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ])
    )
):

    return create_rfq_service(
        payload,
        db,
        current_user
    )


@router.patch("/{rfq_id}/status")
def update_rfq_status(

    rfq_id: int,

    payload: RFQStatusUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER
        ]),
        
    )
):

    return update_rfq_status_service(
    rfq_id,
    payload.status,
    db,
    current_user
    )


@router.get("/{rfq_id}/export-pdf")
def export_rfq_pdf(
    rfq_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([
            UserRole.ADMIN,
            UserRole.MERCHANDISER,
            UserRole.MEMBER,
        ])
    ),
):
    import traceback
    try:
        pdf_bytes = generate_product_pdf(rfq_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        tb = traceback.format_exc()
        print("PDF GENERATION ERROR:\n", tb)
        raise HTTPException(status_code=500, detail=tb)

    rfq_num = f"rfq-{rfq_id}"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="product-record-{rfq_num}.pdf"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )


_RFQ_ALLOWED_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".webp",
    ".pdf", ".doc", ".docx", ".xlsx", ".xls", ".zip",
}
_RFQ_MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@router.post("/upload-attachment")
async def upload_rfq_attachment(
    file: UploadFile = File(...),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])
    )
):
    ext = os.path.splitext(file.filename or "")[-1].lower()
    if ext not in _RFQ_ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Allowed: {', '.join(_RFQ_ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > _RFQ_MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 20 MB)")

    os.makedirs("uploads/rfq_attachments", exist_ok=True)
    safe_name = f"{uuid.uuid4()}{ext}"
    path = os.path.join("uploads", "rfq_attachments", safe_name)
    with open(path, "wb") as f:
        f.write(content)

    return {"url": f"/uploads/rfq_attachments/{safe_name}", "filename": file.filename}


@router.delete("/{rfq_id}")
def delete_rfq(

    rfq_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles([
            UserRole.ADMIN
        ])
    )
):

    return delete_rfq_service(
        rfq_id,
        db,
          current_user
    )