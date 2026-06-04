"""
Product Record PDF — generated in-memory, never saved to disk.
Structure (one section per page):
  Page 1  – Product Overview
  Page 2  – Tech Pack & Reference Images
  Page 3  – Style Sheet
  Page 4  – Bill of Materials
"""
import io
import os
import urllib.request
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from sqlalchemy.orm import Session

from app.models.rfq_model import RFQ
from app.models.bom_model import BOM
from app.models.style_sheet_model import StyleSheet

# ── Page geometry ─────────────────────────────────────────────────────────────
W, H     = A4
MARGIN   = 18 * mm
TOP_BAR  = 22 * mm   # height of the dark header band
FOOT_H   = 14 * mm   # space reserved for footer
CONTENT_W = W - 2 * MARGIN
FRAME_H   = H - TOP_BAR - FOOT_H - 4 * mm

# ── Colours ───────────────────────────────────────────────────────────────────
C_DARK   = colors.HexColor("#1A1F2E")
C_ORANGE = colors.HexColor("#F97316")
C_WHITE  = colors.white
C_LGRAY  = colors.HexColor("#F3F4F6")
C_MGRAY  = colors.HexColor("#D1D5DB")
C_TEXT   = colors.HexColor("#111827")
C_MUTED  = colors.HexColor("#6B7280")

# ── Paragraph styles ──────────────────────────────────────────────────────────
def _s(name, **kw):
    return ParagraphStyle(name, **kw)

STYLES = {
    "section": _s("section", fontSize=11, fontName="Helvetica-Bold",
                  textColor=C_DARK,  spaceBefore=4, spaceAfter=3),
    "label":   _s("label",   fontSize=7,  fontName="Helvetica-Bold",
                  textColor=C_MUTED, spaceBefore=3),
    "value":   _s("value",   fontSize=9,  fontName="Helvetica",
                  textColor=C_TEXT,  spaceAfter=3),
    "cell_h":  _s("cell_h",  fontSize=7,  fontName="Helvetica-Bold",
                  textColor=C_WHITE),
    "cell":    _s("cell",    fontSize=8,  fontName="Helvetica",
                  textColor=C_TEXT),
    "small":   _s("small",   fontSize=7,  fontName="Helvetica",
                  textColor=C_MUTED),
    "url":     _s("url",     fontSize=8,  fontName="Helvetica",
                  textColor=C_ORANGE),
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _new_frame() -> Frame:
    """Every page template gets its own fresh Frame (ReportLab mutates them)."""
    return Frame(
        MARGIN, FOOT_H + 2 * mm,
        CONTENT_W, FRAME_H,
        id="body",
        leftPadding=0, rightPadding=0,
        topPadding=4, bottomPadding=4,
    )


def _draw_header(canvas, doc, title: str, rfq_number: str):
    canvas.saveState()
    # Dark band
    canvas.setFillColor(C_DARK)
    canvas.rect(0, H - TOP_BAR, W, TOP_BAR, fill=1, stroke=0)
    # Orange left accent
    canvas.setFillColor(C_ORANGE)
    canvas.rect(0, H - TOP_BAR, 4 * mm, TOP_BAR, fill=1, stroke=0)
    # Section title
    canvas.setFont("Helvetica-Bold", 12)
    canvas.setFillColor(C_WHITE)
    canvas.drawString(MARGIN, H - TOP_BAR + 7 * mm, title)
    # RFQ number (right)
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(C_ORANGE)
    canvas.drawRightString(W - MARGIN, H - TOP_BAR + 7 * mm, rfq_number)
    # Footer rule + text
    canvas.setStrokeColor(C_MGRAY)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, FOOT_H, W - MARGIN, FOOT_H)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(C_MUTED)
    canvas.drawCentredString(
        W / 2, FOOT_H / 2,
        f"STCH Product Record  ·  {rfq_number}  ·  "
        f"{datetime.now().strftime('%d %b %Y')}  ·  Page {doc.page}",
    )
    canvas.restoreState()


def _load_image(url_or_path: str, max_w: float, max_h: float):
    """
    Return a ReportLab Image flowable or None (never raises).
    Handles local /uploads/... paths and http(s):// URLs.
    """
    if not url_or_path:
        return None
    try:
        if url_or_path.startswith("/uploads/"):
            local = url_or_path.lstrip("/")   # "uploads/rfq_attachments/..."
            if not os.path.isfile(local):
                return None
            reader = ImageReader(local)
            iw, ih = reader.getSize()
            scale  = min(max_w / iw, max_h / ih, 1.0)
            return Image(local, width=iw * scale, height=ih * scale)

        if url_or_path.startswith(("http://", "https://")):
            req = urllib.request.Request(
                url_or_path, headers={"User-Agent": "STCH-PDF/1.0"}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                raw = resp.read()
            # Use bytes for size probe, then a fresh BytesIO for the Image
            reader = ImageReader(io.BytesIO(raw))
            iw, ih = reader.getSize()
            scale  = min(max_w / iw, max_h / ih, 1.0)
            return Image(io.BytesIO(raw), width=iw * scale, height=ih * scale)

    except Exception:
        pass
    return None


def _section_bar(title: str) -> Table:
    t = Table([[Paragraph(title, STYLES["section"])]],
              colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), C_LGRAY),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW",     (0, 0), (-1, -1), 1.5, C_ORANGE),
    ]))
    return t


def _field(label: str, value) -> list:
    if not value:
        return []
    return [
        Paragraph(label.upper(), STYLES["label"]),
        Paragraph(str(value), STYLES["value"]),
    ]


def _grid(pairs: list) -> Table:
    """Two-column label/value grid."""
    col = CONTENT_W / 2
    rows, row = [], []
    for lbl, val in pairs:
        cell = [
            Paragraph(lbl.upper(), STYLES["label"]),
            Paragraph(str(val) if val else "—", STYLES["value"]),
        ]
        row.append(cell)
        if len(row) == 2:
            rows.append(row); row = []
    if row:
        rows.append(row + [[Paragraph("", STYLES["value"])]])
    if not rows:
        return Spacer(1, 1)
    t = Table(rows, colWidths=[col, col])
    t.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
        ("TOPPADDING",    (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


# ── Section builders ─────────────────────────────────────────────────────────

def _page1(rfq: RFQ) -> list:
    s = []

    s.append(_section_bar("Brand Information"))
    s.append(Spacer(1, 3 * mm))
    s.append(_grid([
        ("Brand",        rfq.brand),
        ("Season",       rfq.season),
        ("Department",   rfq.department),
        ("Category",     rfq.category or "—"),
        ("Sub-Category", rfq.sub_category or "—"),
        ("Priority",     rfq.priority.value if rfq.priority else "—"),
    ]))
    s.append(Spacer(1, 4 * mm))

    s.append(_section_bar("Garment Specifications"))
    s.append(Spacer(1, 3 * mm))
    s.append(_grid([
        ("Garment Type",       rfq.garment_type),
        ("Fabric Type",        rfq.fabric_type),
        ("Fabric Weight",      rfq.fabric_weight),
        ("Fabric Composition", rfq.fabric_composition),
        ("Construction",       rfq.construction or "—"),
        ("Yarn Count",         rfq.yarn_count or "—"),
    ]))
    s.append(Spacer(1, 4 * mm))

    s.append(_section_bar("Order Details"))
    s.append(Spacer(1, 3 * mm))
    s.append(_grid([
        ("Quantity",      f"{rfq.quantity:,} pcs"),
        ("Target Price",  f"{rfq.currency} {rfq.target_price:,.2f}"),
        ("Delivery Date", str(rfq.delivery_date)),
        ("Incoterms",     rfq.incoterms),
    ]))
    s.append(Spacer(1, 4 * mm))

    s.append(_section_bar("Trims & Packaging"))
    s.append(Spacer(1, 3 * mm))
    s.append(_grid([
        ("Packaging Type", rfq.packaging_type),
        ("Label Type",     rfq.label_type),
    ]))
    if rfq.trims_details:
        s.extend(_field("Trims Details", rfq.trims_details))

    return s


def _page2(rfq: RFQ) -> list:
    s = []

    # Tech pack
    s.append(_section_bar("Tech Pack"))
    s.append(Spacer(1, 4 * mm))
    img = _load_image(rfq.tech_pack_url, CONTENT_W, 110 * mm)
    if img:
        img.hAlign = "CENTER"
        s.append(img)
        s.append(Spacer(1, 2 * mm))
        s.append(Paragraph(rfq.tech_pack_url, STYLES["small"]))
    elif rfq.tech_pack_url:
        s.extend(_field("Tech Pack Document", rfq.tech_pack_url))
    else:
        s.append(Paragraph("No tech pack attached.", STYLES["small"]))

    s.append(Spacer(1, 5 * mm))

    # Reference images
    s.append(_section_bar("Reference Images"))
    s.append(Spacer(1, 4 * mm))
    lines = [l.strip() for l in (rfq.reference_images or "").splitlines() if l.strip()]
    if lines:
        cell_w = (CONTENT_W - 4 * mm) / 3
        cells = []
        for url in lines[:6]:
            img = _load_image(url, cell_w, 50 * mm)
            cells.append(img if img else Paragraph(url, STYLES["url"]))
        while len(cells) % 3:
            cells.append("")
        rows = [cells[i:i+3] for i in range(0, len(cells), 3)]
        tbl = Table(rows, colWidths=[cell_w] * 3)
        tbl.setStyle(TableStyle([
            ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
            ("GRID",          (0, 0), (-1, -1), 0.5, C_MGRAY),
            ("TOPPADDING",    (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        s.append(tbl)
    else:
        s.append(Paragraph("No reference images attached.", STYLES["small"]))

    s.append(Spacer(1, 5 * mm))

    # Wash / finish / compliance
    s.append(_section_bar("Wash, Finish & Compliance"))
    s.append(Spacer(1, 3 * mm))

    def _join(v):
        return ", ".join(v) if isinstance(v, list) else (v or "—")

    s.append(_grid([
        ("Garment Wash",         _join(rfq.garment_wash)),
        ("Dye Type",             rfq.dye_type or "—"),
        ("Print Type",           rfq.print_type or "—"),
        ("Embroidery",           rfq.embroidery_type or "—"),
        ("Special Finish",       rfq.special_finish or "—"),
        ("Compliance Standards", _join(rfq.compliance_standards)),
        ("Testing Required",     _join(rfq.testing_required)),
        ("Social Compliance",    rfq.social_compliance or "—"),
        ("Quality Standards",    rfq.quality_standards or "—"),
    ]))

    if rfq.notes:
        s.append(Spacer(1, 4 * mm))
        s.append(_section_bar("Additional Notes"))
        s.append(Spacer(1, 3 * mm))
        s.append(Paragraph(rfq.notes, STYLES["value"]))

    return s


def _page3(ss) -> list:
    s = []
    s.append(_section_bar("Style Sheet"))
    s.append(Spacer(1, 4 * mm))

    if ss is None:
        s.append(Paragraph("No style sheet has been created for this RFQ.", STYLES["small"]))
        return s

    # Front + back images side by side
    half = CONTENT_W / 2 - 4 * mm
    front = _load_image(ss.front_image_url, half, 90 * mm)
    back  = _load_image(ss.back_image_url,  half, 90 * mm)

    if front or back:
        img_tbl = Table(
            [[front or Paragraph("Front image not available.", STYLES["small"]),
              back  or Paragraph("Back image not available.",  STYLES["small"])],
             [Paragraph("FRONT VIEW", STYLES["small"]),
              Paragraph("BACK VIEW",  STYLES["small"])]],
            colWidths=[CONTENT_W / 2, CONTENT_W / 2],
        )
        img_tbl.setStyle(TableStyle([
            ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
            ("VALIGN",        (0, 0), (-1, 0),  "BOTTOM"),
            ("GRID",          (0, 0), (-1, -1), 0.5, C_MGRAY),
            ("TOPPADDING",    (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        s.append(img_tbl)
        s.append(Spacer(1, 5 * mm))

    s.append(_section_bar("Specifications"))
    s.append(Spacer(1, 3 * mm))
    for lbl, val in [
        ("Fit Type",        ss.fit_type),
        ("Fabric Details",  ss.fabric_details),
        ("Wash Details",    ss.wash_details),
        ("Stitch Details",  ss.stitch_details),
        ("Label Placement", ss.label_placement),
        ("Artwork Notes",   ss.artwork_notes),
        ("Packaging Notes", ss.packaging_notes),
    ]:
        if val:
            s.extend(_field(lbl, val))
            s.append(Spacer(1, 1 * mm))

    s.append(Spacer(1, 3 * mm))
    s.append(Paragraph(f"Status: {ss.status.value}", STYLES["small"]))
    return s


def _page4(bom) -> list:
    s = []
    s.append(_section_bar("Bill of Materials"))
    s.append(Spacer(1, 4 * mm))

    if bom is None or not bom.items:
        s.append(Paragraph("No BOM has been created for this RFQ.", STYLES["small"]))
        return s

    s.append(Paragraph(f"Status: {bom.status.value}", STYLES["small"]))
    s.append(Spacer(1, 4 * mm))

    COL_W = [8*mm, 34*mm, 22*mm, 20*mm, 14*mm, 18*mm, 28*mm]
    COL_W.append(CONTENT_W - sum(COL_W))   # Remarks fills the rest

    hdrs = ["#", "Material", "Type", "Consumption", "Unit", "Cost", "Supplier", "Remarks"]
    rows = [[Paragraph(h, STYLES["cell_h"]) for h in hdrs]]

    for i, item in enumerate(sorted(bom.items, key=lambda x: x.sort_order)):
        rows.append([
            Paragraph(str(i + 1),                          STYLES["cell"]),
            Paragraph(item.material or "—",                STYLES["cell"]),
            Paragraph(item.material_type or "—",           STYLES["cell"]),
            Paragraph(f"{item.consumption:.3f}" if item.consumption is not None else "—", STYLES["cell"]),
            Paragraph(item.unit or "—",                    STYLES["cell"]),
            Paragraph(f"{item.cost:.2f}" if item.cost is not None else "—", STYLES["cell"]),
            Paragraph(item.supplier or "—",                STYLES["cell"]),
            Paragraph(item.remarks or "—",                 STYLES["cell"]),
        ])

    tbl = Table(rows, colWidths=COL_W, repeatRows=1)
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  C_DARK),
        ("LINEBELOW",     (0, 0), (-1, 0),  2, C_ORANGE),
        *[("BACKGROUND",  (0, r), (-1, r),  C_LGRAY) for r in range(2, len(rows), 2)],
        ("GRID",          (0, 0), (-1, -1), 0.4, C_MGRAY),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
    ]))
    s.append(tbl)

    total = sum((i.cost or 0) * (i.consumption or 0) for i in bom.items)
    if total > 0:
        s.append(Spacer(1, 4 * mm))
        summary = Table(
            [[Paragraph("ESTIMATED MATERIAL COST", STYLES["label"]),
              Paragraph(f"{total:,.2f}", STYLES["section"])]],
            colWidths=[CONTENT_W * 0.7, CONTENT_W * 0.3],
        )
        summary.setStyle(TableStyle([
            ("ALIGN",      (1, 0), (1, 0), "RIGHT"),
            ("LINEABOVE",  (0, 0), (-1, 0), 1, C_ORANGE),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
        ]))
        s.append(summary)

    return s


# ── Public entry point ────────────────────────────────────────────────────────

def generate_product_pdf(rfq_id: int, db: Session) -> bytes:
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
    if rfq is None:
        raise ValueError("RFQ not found")

    bom = db.query(BOM).filter(BOM.rfq_id == rfq_id).first()
    ss  = db.query(StyleSheet).filter(StyleSheet.rfq_id == rfq_id).first()
    rfq_num = rfq.rfq_number or f"RFQ-{rfq_id}"

    buf = io.BytesIO()

    doc = BaseDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=TOP_BAR + 4 * mm,
        bottomMargin=FOOT_H + 4 * mm,
    )

    # Each template gets its OWN fresh frame — ReportLab mutates frames during build
    def _make_tpl(tid, title):
        def _cb(canvas, doc):
            _draw_header(canvas, doc, title, rfq_num)
        return PageTemplate(id=tid, frames=[_new_frame()], onPage=_cb)

    doc.addPageTemplates([
        _make_tpl("overview",   "PRODUCT OVERVIEW"),
        _make_tpl("techpack",   "TECH PACK & REFERENCES"),
        _make_tpl("stylesheet", "STYLE SHEET"),
        _make_tpl("bom",        "BILL OF MATERIALS"),
    ])

    story = []

    # Page 1 — overview (first template used automatically)
    story.extend(_page1(rfq))

    # Page 2 — tech pack
    story.append(NextPageTemplate("techpack"))
    story.append(PageBreak())
    story.extend(_page2(rfq))

    # Page 3 — style sheet
    story.append(NextPageTemplate("stylesheet"))
    story.append(PageBreak())
    story.extend(_page3(ss))

    # Page 4 — BOM
    story.append(NextPageTemplate("bom"))
    story.append(PageBreak())
    story.extend(_page4(bom))

    doc.build(story)
    return buf.getvalue()
