from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine

from app.routes.auth_routes import router as auth_router
from app.routes.rfq_routes import router as rfq_router
from app.routes.newUser_routes import router as newUser_routes

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  # Your React dev server
    "http://127.0.0.1:5173",
]
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(auth_router)
app.include_router(rfq_router)
app.include_router(newUser_routes)


@app.get("/")
def root():
    return {
        "message": "STCH Backend Running"
    }