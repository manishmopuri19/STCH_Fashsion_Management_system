from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.db.database import (
    Base,
    engine
)

import app.models


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

Base.metadata.create_all(bind=engine)

app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

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

@app.get("/")
def root():

    return {

        "message":
        "STCH Backend Running"
    }