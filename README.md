STCH — Supply Chain & Merchandising Management Platform
STCH is a full-stack platform for apparel manufacturing businesses that digitizes the end-to-end production workflow — from an initial customer RFQ through product development, purchase order creation, style/color/size production planning, milestone (TNA) tracking, and quality control.

Instead of managing quotes, samples, and production schedules across spreadsheets and email, STCH gives every stakeholder (admin, merchandiser, supplier, QC inspector) a role-specific view of a single shared pipeline, and enforces business rules automatically — a PO can't be created until product development gates are cleared, and every style gets an auto-generated production schedule the moment it's added.

Workflow
RFQ  →  Product Development  →  PO  →  Style / Color / Size  →  TNA  →  QC
      (Mini Marker, BOM,          (Purchase        (per-style       (Time & Action    (Inline/Final
       Style Sheet, Sampling)      Order)            production      milestones,        Inspection)
                                                       spec)           delay tracking)
RFQ (Request for Quote) — customer inquiries are logged and collaborated on with suppliers for pricing.
Product Development — before a PO can be created, the RFQ must clear a readiness gate: Mini Marker (fabric layout), BOM (Bill of Materials), Style Sheet, and an approved PP (pre-production) sample.
PO (Purchase Order) — generated once product development is approved.
Style / Color / Size — each PO can contain multiple styles; each style has colors (with fabric swatch images); each color has sizes with quantities.
TNA (Time & Action) — each style automatically gets 12 production milestones, back-calculated from the delivery date, with delay reasons tracked per milestone.
QC (Quality Control) — a dedicated QC role performs inline/final inspections and logs defects before shipment.
Features
Role-based access control across 5 roles: Admin, Merchandiser, Member, Supplier, Quality Control — each sees only the data and actions relevant to them.
JWT-based authentication with token expiry and password hashing (bcrypt).
A readiness engine (GET /rfqs/{id}/readiness) that gates PO creation on completed product-development steps.
Auto-generated TNA milestone schedules per style, with delay analytics.
Fabric swatch and document uploads.
Rate limiting (slowapi) and configurable CORS via environment variables.
PDF export support (reportlab).
Tech Stack
Backend

FastAPI — REST API framework
SQLAlchemy — ORM (SQLite by default, swappable via DATABASE_URL)
Pydantic — request/response validation
python-jose + passlib[bcrypt] — JWT auth and password hashing
slowapi — rate limiting
reportlab — PDF generation
uvicorn — ASGI server
Frontend

React 19 + Vite
React Router — routing with role-protected routes
React Hook Form + Zod — form handling and validation
Tailwind CSS — styling
Axios — API client with auth interceptors
Lucide React — icons
Project Structure
STCH/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entrypoint, CORS, DB migrations on startup
│   │   ├── routes/            # API routes (rfq, po, style, tna, qc, auth, users, ...)
│   │   ├── services/          # Business logic per domain
│   │   ├── models/            # SQLAlchemy models
│   │   ├── enums/             # Status/role enums
│   │   ├── utils/             # Permissions, auth helpers
│   │   └── core/              # Auth/config core
│   ├── requirements.txt
│   └── .env                   # DATABASE_URL, SECRET_KEY, ALGORITHM, ALLOWED_ORIGINS
└── frontend/
    ├── src/
    │   ├── pages/              # RFQ, Orders/Styles, QC, Auth pages
    │   ├── components/         # Shared + workflow components
    │   ├── api/ , services/    # Axios client, API calls
    │   └── utils/               # ProtectedRoute, helpers
    └── package.json
Getting Started
Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
Configure backend/.env:

DATABASE_URL=sqlite:///./stch.db
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24
ALLOWED_ORIGINS=http://localhost:5173
Frontend
cd frontend
npm install
npm run dev
The app will be available at http://localhost:5173, talking to the API at the URL configured in frontend/src/api/axios.js.

Roles
Role	Access
Admin	Full access — RFQs, POs, styles, TNA, QC, user management, suppliers
Merchandiser	Full CRUD on RFQs, product development, POs, styles, TNA; manages QC team
Member	Views/updates only their assigned TNA records
Supplier	Views/updates only their own RFQ quotations
Quality Control	Performs and views QC inspections; sees Orders and Dashboard only
