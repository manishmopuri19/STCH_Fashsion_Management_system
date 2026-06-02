from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import SessionLocal
from app.core.permissions import require_roles
from app.enums.user_enums import UserRole

from app.schemas.style_schema import POStyleCreate, ColorSizeCreate
from app.schemas.tna_schema import CreateStyleTNASchema
from app.services.style_services.create_style import create_style_service
from app.services.style_services.get_styles import get_styles_service, get_style_detail_service
from app.services.style_services.create_color import create_color_service
from app.services.style_services.create_size import create_size_service, update_size_service, delete_size_service
from app.services.style_services.get_style_tnas import get_style_tnas_service, get_my_tnas_service
from app.services.tna_services.create_style_tna import create_style_tna_service
from app.services.tna_services.delete_tna import delete_tna_service
from app.services.user_services.get_internal_users import get_internal_users_service

router = APIRouter(prefix="/styles", tags=["Styles"])


INDUSTRY_COLORS = [
    {"name": "White", "hex": "#FFFFFF", "category": "Whites & Neutrals"},
    {"name": "Off-White", "hex": "#FAF9F6", "category": "Whites & Neutrals"},
    {"name": "Ivory", "hex": "#FFFFF0", "category": "Whites & Neutrals"},
    {"name": "Cream", "hex": "#FFFDD0", "category": "Whites & Neutrals"},
    {"name": "Beige", "hex": "#F5F5DC", "category": "Whites & Neutrals"},
    {"name": "Ecru", "hex": "#C2B280", "category": "Whites & Neutrals"},
    {"name": "Light Grey", "hex": "#D3D3D3", "category": "Greys"},
    {"name": "Medium Grey", "hex": "#9E9E9E", "category": "Greys"},
    {"name": "Charcoal Grey", "hex": "#36454F", "category": "Greys"},
    {"name": "Dark Grey", "hex": "#404040", "category": "Greys"},
    {"name": "Slate Grey", "hex": "#708090", "category": "Greys"},
    {"name": "Black", "hex": "#000000", "category": "Blacks"},
    {"name": "Off-Black", "hex": "#1C1C1C", "category": "Blacks"},
    {"name": "Carbon", "hex": "#2C2C2C", "category": "Blacks"},
    {"name": "Navy Blue", "hex": "#000080", "category": "Blues"},
    {"name": "Royal Blue", "hex": "#4169E1", "category": "Blues"},
    {"name": "Sky Blue", "hex": "#87CEEB", "category": "Blues"},
    {"name": "Baby Blue", "hex": "#89CFF0", "category": "Blues"},
    {"name": "Cobalt Blue", "hex": "#0047AB", "category": "Blues"},
    {"name": "Denim Blue", "hex": "#1560BD", "category": "Blues"},
    {"name": "Teal", "hex": "#008080", "category": "Blues"},
    {"name": "Prussian Blue", "hex": "#003153", "category": "Blues"},
    {"name": "Powder Blue", "hex": "#B0E0E6", "category": "Blues"},
    {"name": "Forest Green", "hex": "#228B22", "category": "Greens"},
    {"name": "Olive Green", "hex": "#556B2F", "category": "Greens"},
    {"name": "Mint Green", "hex": "#98FF98", "category": "Greens"},
    {"name": "Sage Green", "hex": "#BCB88A", "category": "Greens"},
    {"name": "Bottle Green", "hex": "#006A4E", "category": "Greens"},
    {"name": "Khaki", "hex": "#C3B091", "category": "Greens"},
    {"name": "Army Green", "hex": "#4B5320", "category": "Greens"},
    {"name": "Emerald Green", "hex": "#50C878", "category": "Greens"},
    {"name": "Red", "hex": "#FF0000", "category": "Reds"},
    {"name": "Burgundy", "hex": "#800020", "category": "Reds"},
    {"name": "Maroon", "hex": "#800000", "category": "Reds"},
    {"name": "Wine", "hex": "#722F37", "category": "Reds"},
    {"name": "Crimson", "hex": "#DC143C", "category": "Reds"},
    {"name": "Cherry Red", "hex": "#9B111E", "category": "Reds"},
    {"name": "Tomato Red", "hex": "#FF6347", "category": "Reds"},
    {"name": "Pink", "hex": "#FFC0CB", "category": "Pinks"},
    {"name": "Hot Pink", "hex": "#FF69B4", "category": "Pinks"},
    {"name": "Baby Pink", "hex": "#F4C2C2", "category": "Pinks"},
    {"name": "Rose", "hex": "#FF007F", "category": "Pinks"},
    {"name": "Dusty Rose", "hex": "#DCAE96", "category": "Pinks"},
    {"name": "Blush", "hex": "#DE5D83", "category": "Pinks"},
    {"name": "Magenta", "hex": "#FF00FF", "category": "Pinks"},
    {"name": "Fuchsia", "hex": "#FF00FF", "category": "Pinks"},
    {"name": "Orange", "hex": "#FFA500", "category": "Oranges"},
    {"name": "Burnt Orange", "hex": "#CC5500", "category": "Oranges"},
    {"name": "Rust", "hex": "#B7410E", "category": "Oranges"},
    {"name": "Terracotta", "hex": "#E2725B", "category": "Oranges"},
    {"name": "Peach", "hex": "#FFCBA4", "category": "Oranges"},
    {"name": "Coral", "hex": "#FF6B6B", "category": "Oranges"},
    {"name": "Yellow", "hex": "#FFFF00", "category": "Yellows"},
    {"name": "Mustard", "hex": "#FFDB58", "category": "Yellows"},
    {"name": "Gold", "hex": "#FFD700", "category": "Yellows"},
    {"name": "Lemon Yellow", "hex": "#FFF44F", "category": "Yellows"},
    {"name": "Butter Yellow", "hex": "#FFFD74", "category": "Yellows"},
    {"name": "Purple", "hex": "#800080", "category": "Purples"},
    {"name": "Lavender", "hex": "#E6E6FA", "category": "Purples"},
    {"name": "Lilac", "hex": "#C8A2C8", "category": "Purples"},
    {"name": "Violet", "hex": "#EE82EE", "category": "Purples"},
    {"name": "Plum", "hex": "#8E4585", "category": "Purples"},
    {"name": "Mauve", "hex": "#E0B0FF", "category": "Purples"},
    {"name": "Brown", "hex": "#964B00", "category": "Browns"},
    {"name": "Tan", "hex": "#D2B48C", "category": "Browns"},
    {"name": "Camel", "hex": "#C19A6B", "category": "Browns"},
    {"name": "Chocolate", "hex": "#7B3F00", "category": "Browns"},
    {"name": "Coffee", "hex": "#6F4E37", "category": "Browns"},
    {"name": "Mocha", "hex": "#8B5E3C", "category": "Browns"},
    {"name": "Walnut", "hex": "#5C3317", "category": "Browns"},
    {"name": "Sand", "hex": "#C2B280", "category": "Browns"},
    {"name": "Indigo", "hex": "#4B0082", "category": "Blues"},
    {"name": "Turquoise", "hex": "#40E0D0", "category": "Blues"},
    {"name": "Aqua", "hex": "#00FFFF", "category": "Blues"},
    {"name": "Lime Green", "hex": "#32CD32", "category": "Greens"},
    {"name": "Printed", "hex": None, "category": "Special"},
    {"name": "Stripe", "hex": None, "category": "Special"},
    {"name": "Check", "hex": None, "category": "Special"},
    {"name": "Plaid", "hex": None, "category": "Special"},
    {"name": "Jacquard", "hex": None, "category": "Special"},
    {"name": "Yarn Dyed", "hex": None, "category": "Special"},
]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Industry Colors (static list) ─────────────────────────────────────────

@router.get("/industry-colors")
def get_industry_colors():
    return INDUSTRY_COLORS


# ─── Internal Users (for assigned-to dropdown) ─────────────────────────────

@router.get("/internal-users")
def get_internal_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return get_internal_users_service(db)


# ─── My TNAs (for assigned users) ──────────────────────────────────────────

@router.get("/my-tnas")
def get_my_tnas(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.MEMBER, UserRole.QC])
    ),
):
    return get_my_tnas_service(current_user, db)


# ─── PO Styles ─────────────────────────────────────────────────────────────

@router.post("/po/{po_id}")
def create_style(
    po_id: int,
    payload: POStyleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return create_style_service(po_id, payload, db)


@router.get("/po/{po_id}")
def get_styles(
    po_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.MEMBER, UserRole.SUPPLIER, UserRole.QC])
    ),
):
    return get_styles_service(po_id, db)


@router.get("/{style_id}")
def get_style_detail(
    style_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.MEMBER, UserRole.SUPPLIER, UserRole.QC])
    ),
):
    return get_style_detail_service(style_id, db)


# ─── Style TNAs ────────────────────────────────────────────────────────────

@router.get("/{style_id}/tna")
def get_style_tnas(
    style_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles([UserRole.ADMIN, UserRole.MERCHANDISER, UserRole.MEMBER, UserRole.QC])
    ),
):
    return get_style_tnas_service(style_id, current_user, db)


@router.post("/{style_id}/tna")
def create_custom_tna(
    style_id: int,
    payload: CreateStyleTNASchema,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return create_style_tna_service(style_id, payload, db)


@router.delete("/tna/{tna_id}")
def delete_custom_tna(
    tna_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return delete_tna_service(tna_id, db)


# ─── Colors ────────────────────────────────────────────────────────────────

@router.post("/{style_id}/colors")
def create_color(
    style_id: int,
    color_name: str = Form(...),
    hex_value: Optional[str] = Form(None),
    fabric_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return create_color_service(style_id, color_name, hex_value, db, fabric_image)


# ─── Sizes ─────────────────────────────────────────────────────────────────

@router.post("/colors/{color_id}/sizes")
def create_size(
    color_id: int,
    payload: ColorSizeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return create_size_service(color_id, payload, db)


@router.patch("/sizes/{size_id}")
def update_size(
    size_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return update_size_service(size_id, quantity, db)


@router.delete("/sizes/{size_id}")
def delete_size(
    size_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles([UserRole.ADMIN, UserRole.MERCHANDISER])),
):
    return delete_size_service(size_id, db)
