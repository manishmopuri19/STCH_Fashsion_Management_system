import os
import logging

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from fastapi.middleware.cors import (
    CORSMiddleware
)
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.db.database import (
    Base,
    engine
)

import app.models


def run_db_migrations(engine):
    """Add new columns to existing tables without data loss (SQLite safe)."""
    migrations = [
        "ALTER TABLE tnas ADD COLUMN style_id INTEGER",
        "ALTER TABLE tnas ADD COLUMN delayed_reason TEXT",
        "ALTER TABLE quality_inspections ADD COLUMN assigned_to INTEGER REFERENCES users(id)",
        "ALTER TABLE rfqs ADD COLUMN customer_id INTEGER REFERENCES customers(id)",
        "ALTER TABLE users ADD COLUMN phone TEXT",
        "ALTER TABLE users ADD COLUMN department TEXT",
        "ALTER TABLE users ADD COLUMN designation TEXT",
    ]
    with engine.connect() as conn:
        for sql in migrations:
            try:
                conn.execute(text(sql))
                conn.commit()
            except Exception:
                pass


# ROUTES
from app.routes.auth_routes import (
    router as auth_router
)

from app.routes.rfq_routes import (
    router as rfq_router
)

from app.routes.newUser_routes import (
    router as newUser_routes
)

from app.routes.rfq_supplier_routes import (
    router as rfq_supplier_router
)

from app.routes.tna_routes import (
    router as tna_router
)

from app.routes.supplier_routes import (
    router as supplier_router
)

from app.routes.po_routes import (
    router as po_router
)

from app.routes.qc_routes import (
    router as qc_router
)

from app.routes.collaboration_routes import(router as collaboration_router
)

from app.routes.catalogue_routes import (
    router as catalogue_routes
)

from app.routes.dashboard_routes import (router as dashboard_router)
from app.routes.mini_marker_routes import (router as mini_marker_router)
from app.routes.bom_routes import (router as bom_router)
from app.routes.style_sheet_routes import (router as style_sheet_router)
from app.routes.sampling_routes import (router as sampling_router)
from app.routes.product_dev_routes import (router as product_dev_router)
from app.routes.style_routes import (router as style_router)
from app.routes.customer_routes import (router as customer_router)

run_db_migrations(engine)
Base.metadata.create_all(bind=engine)


def seed_admin():
    from app.db.database import SessionLocal
    from app.models.user_model import User
    from app.enums.user_enums import UserRole
    from app.utils.passwordEncryption import hash_password

    admin_email = os.getenv("ADMIN_EMAIL", "admin@stch.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    admin_name = os.getenv("ADMIN_NAME", "Admin")

    if admin_password == "admin123":
        logging.warning(
            "SECURITY WARNING: ADMIN_PASSWORD is set to the default 'admin123'. "
            "Set ADMIN_PASSWORD in your .env file immediately."
        )

    db = SessionLocal()
    try:
        exists = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if not exists:
            admin = User(
                userName=admin_name,
                email=admin_email,
                password=hash_password(admin_password),
                role=UserRole.ADMIN,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


seed_admin()

from app.core.limiter import limiter

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

os.makedirs("uploads/fabric_swatches", exist_ok=True)
os.makedirs("uploads/rfq_attachments", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# CORS
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
   
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ROUTES
app.include_router(auth_router)
app.include_router(rfq_router)
app.include_router(rfq_supplier_router)
app.include_router(newUser_routes)
app.include_router(tna_router)
app.include_router(supplier_router)
app.include_router(po_router)
app.include_router(qc_router)
app.include_router(catalogue_routes)
app.include_router(collaboration_router)
app.include_router(dashboard_router)
app.include_router(mini_marker_router)
app.include_router(bom_router)
app.include_router(style_sheet_router)
app.include_router(sampling_router)
app.include_router(product_dev_router)
app.include_router(style_router)
app.include_router(customer_router)

@app.get("/")
def root():

    return {
        "message":
        "STCH Backend Running"
    }