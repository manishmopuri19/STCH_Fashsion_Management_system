import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, FileSpreadsheet, ArrowLeft, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import API from "../../api/axios";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt   = (v) => (v == null || v === "" ? null : String(v));
const money  = (v, cur = "₹") => v != null ? `${cur} ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null;
const pct    = (v) => v != null ? `${v}%` : null;
const qty    = (v) => v != null ? Number(v).toLocaleString("en-IN") + " pcs" : null;

const STATUS_LABELS = {
  NOT_STARTED: "Not Started", IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",     APPROVED: "Approved",
  SUBMITTED: "Submitted",     UNDER_REVIEW: "Under Review",
  REJECTED: "Rejected",
};
const SAMPLE_LABELS = {
  PROTO: "Proto Sample", FIT: "Fit Sample", PP: "PP Sample",
  SIZE_SET: "Size Set",  SHIPMENT: "Shipment Sample",
};

// ── mini sub-components ───────────────────────────────────────────────────────
function Divider({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0 14px" }}>
      <div style={{ width: 4, height: 20, background: "#f97316", borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#1f2937" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
    </div>
  );
}

function KVBlock({ rows, cols = 2 }) {
  const visible = rows.filter(([, v]) => v != null);
  if (!visible.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "6px 36px" }}>
      {visible.map(([label, value]) => (
        <div key={label} style={{ display: "flex", gap: 8, paddingBottom: 7, borderBottom: "1px solid #f3f4f6", alignItems: "flex-start" }}>
          <span style={{ width: 118, flexShrink: 0, fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.6, paddingTop: 1 }}>{label}</span>
          <span style={{ fontSize: 12, color: "#111827", flex: 1, wordBreak: "break-word", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    APPROVED:     "#d1fae5:#065f46", COMPLETED:    "#dbeafe:#1e40af",
    REJECTED:     "#fee2e2:#991b1b", SUBMITTED:    "#ede9fe:#4c1d95",
    UNDER_REVIEW: "#fef9c3:#713f12", IN_PROGRESS:  "#fff7ed:#c2410c",
    NOT_STARTED:  "#f3f4f6:#6b7280",
  };
  const [bg, color] = (map[status] || map.NOT_STARTED).split(":");
  return (
    <span style={{ padding: "2px 9px", borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", background: bg, color }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function CommercialTile({ label, value, accent }) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 10, border: "1px solid #f3f4f6",
      background: accent ? "#fff7ed" : "#fafafa", flex: 1, minWidth: 100,
    }}>
      <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: accent ? 16 : 13, fontWeight: accent ? 800 : 600, color: accent ? "#ea580c" : "#111", marginTop: 3 }}>{value || "—"}</div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function ProductSheetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]  = useState(true);
  const [rfq, setRfq]          = useState(null);
  const [po, setPo]            = useState(null);
  const [styles, setStyles]    = useState([]);
  const [mm, setMm]            = useState(null);
  const [bom, setBom]          = useState(null);
  const [ss, setSs]            = useState(null);
  const [samples, setSamples]  = useState([]);

  useEffect(() => { loadAll(); }, [id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Wave 1 — everything keyed on RFQ id
      const [rfqR, mmR, bomR, ssR, sampR, poByRfqR] = await Promise.all([
        API.get(`/rfqs/${id}`),
        API.get(`/rfqs/${id}/mini-marker/`).catch(() => ({ data: null })),
        API.get(`/rfqs/${id}/bom/`).catch(() => ({ data: null })),
        API.get(`/rfqs/${id}/style-sheet/`).catch(() => ({ data: null })),
        API.get(`/rfqs/${id}/sampling/`).catch(() => ({ data: [] })),
        API.get(`/purchase-orders/by-rfq/${id}`).catch(() => ({ data: null })),
      ]);
      setRfq(rfqR.data);
      setMm(mmR.data);
      setBom(bomR.data);
      setSs(ssR.data);
      setSamples(Array.isArray(sampR.data) ? sampR.data : []);

      // Wave 2 — only if PO exists
      const poStub = poByRfqR.data;
      if (poStub?.id) {
        const [fullPoR, stylesR] = await Promise.all([
          API.get(`/purchase-orders/${poStub.id}`).catch(() => ({ data: null })),
          API.get(`/styles/po/${poStub.id}`).catch(() => ({ data: [] })),
        ]);
        setPo(fullPoR.data);
        setStyles(Array.isArray(stylesR.data) ? stylesR.data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Excel export ─────────────────────────────────────────────────────────────
  const handleExcel = () => {
    const cur = rfq.currency || "INR";
    const wb  = XLSX.utils.book_new();

    // ── Sheet 1: Overview (RFQ + PO) ──
    const ws1 = XLSX.utils.aoa_to_sheet([
      ["PRODUCT SPECIFICATION SHEET", ""],
      ["RFQ Number",   rfq.rfq_number],
      ["Generated",    new Date().toLocaleDateString("en-IN")],
      ["RFQ Status",   rfq.status],
      ...(po ? [
        [],
        ["── PURCHASE ORDER ──", ""],
        ["PO Number",      po.po_number],
        ["PO Status",      po.status],
        ["Supplier",       po.supplier?.company_name || ""],
        ["Supplier Email", po.supplier?.email || ""],
        ["Supplier Price", po.commercials?.supplier_price != null ? `${cur} ${po.commercials.supplier_price}` : ""],
        ["Target Price",   po.commercials?.target_price  != null ? `${cur} ${po.commercials.target_price}`  : ""],
        ["Margin",         po.commercials?.margin        != null ? `${cur} ${po.commercials.margin}`        : ""],
        ["Profitability",  po.commercials?.profitability != null ? `${po.commercials.profitability}%`        : ""],
        ["Total Amount",   po.commercials?.total_amount  != null ? `${cur} ${po.commercials.total_amount}`  : ""],
        ["Lead Time",      po.lead_time ? `${po.lead_time} days` : ""],
        ["Payment Terms",  po.payment_terms || ""],
      ] : []),
      [],
      ["── BRAND ──", ""],
      ["Brand",       rfq.brand       || ""],
      ["Season",      rfq.season      || ""],
      ["Department",  rfq.department  || ""],
      ["Category",    rfq.category    || ""],
      ["Sub-Category",rfq.sub_category|| ""],
      ["Priority",    rfq.priority    || ""],
      [],
      ["── GARMENT ──", ""],
      ["Garment Type",    rfq.garment_type       || ""],
      ["Fabric Type",     rfq.fabric_type        || ""],
      ["Fabric Weight",   rfq.fabric_weight      || ""],
      ["Composition",     rfq.fabric_composition || ""],
      ["Construction",    rfq.construction       || ""],
      ["Yarn Count",      rfq.yarn_count         || ""],
      [],
      ["── ORDER ──", ""],
      ["Quantity",       rfq.quantity    || ""],
      ["Target Price",   rfq.target_price ? `${cur} ${rfq.target_price}` : ""],
      ["Delivery Date",  rfq.delivery_date || ""],
      ["Incoterms",      rfq.incoterms    || ""],
      [],
      ["── TRIMS & ACCESSORIES ──", ""],
      ["Trims Details",  rfq.trims_details  || ""],
      ["Packaging Type", rfq.packaging_type || ""],
      ["Label Type",     rfq.label_type     || ""],
      [],
      ["── WASH & FINISH ──", ""],
      ["Garment Wash",   (rfq.garment_wash || []).join(", ")],
      ["Dye Type",       rfq.dye_type       || ""],
      ["Print Type",     rfq.print_type     || ""],
      ["Embroidery",     rfq.embroidery_type|| ""],
      ["Special Finish", rfq.special_finish || ""],
      [],
      ["── COMPLIANCE ──", ""],
      ["Standards",         (rfq.compliance_standards || []).join(", ")],
      ["Testing Required",  (rfq.testing_required || []).join(", ")],
      ["Social Compliance", rfq.social_compliance || ""],
      ["Quality Standards", rfq.quality_standards || ""],
      [],
      ["── NOTES ──", ""],
      ["Notes", rfq.notes || ""],
    ]);
    ws1["!cols"] = [{ wch: 22 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Overview");

    // ── Sheet 2: Styles, Colors & Sizes ──
    if (styles.length) {
      const rows = [["Style Code", "Style Name", "Color Name", "Color Code", "Hex", "Size", "Quantity"]];
      styles.forEach(style => {
        if (!style.colors?.length) {
          rows.push([style.style_code, style.style_name, "", "", "", "", ""]);
        } else {
          style.colors.forEach(color => {
            if (!color.sizes?.length) {
              rows.push([style.style_code, style.style_name, color.color_name, color.color_code, color.hex_value || "", "", ""]);
            } else {
              color.sizes.forEach(size => {
                rows.push([style.style_code, style.style_name, color.color_name, color.color_code, color.hex_value || "", size.size_value, size.quantity]);
              });
            }
          });
        }
      });
      // Totals
      rows.push([]);
      styles.forEach(style => {
        rows.push([style.style_code, style.style_name, "TOTAL", "", "", "", style.total_quantity]);
      });
      const totalAll = styles.reduce((s, st) => s + (st.total_quantity || 0), 0);
      rows.push(["", "ALL STYLES", "", "", "", "GRAND TOTAL", totalAll]);

      const ws2 = XLSX.utils.aoa_to_sheet(rows);
      ws2["!cols"] = [{ wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 16 }, { wch: 12 }, { wch: 10 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Styles & Sizes");
    }

    // ── Sheet 3: Bill of Materials ──
    if (bom?.items?.length) {
      const total = bom.items.reduce((s, i) => s + (Number(i.cost) || 0), 0);
      const ws3 = XLSX.utils.aoa_to_sheet([
        ["Material", "Type", "Consumption", "Unit", `Cost (${cur})`, "Supplier", "Remarks"],
        ...bom.items.map(it => [
          it.material, it.material_type,
          it.consumption ?? "", it.unit || "",
          it.cost ?? "", it.supplier || "", it.remarks || "",
        ]),
        [],
        ["TOTAL MATERIAL COST", "", "", "", total.toFixed(2), "", ""],
      ]);
      ws3["!cols"] = [{ wch: 28 }, { wch: 15 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 22 }, { wch: 35 }];
      XLSX.utils.book_append_sheet(wb, ws3, "Bill of Materials");
    }

    // ── Sheet 4: Mini Marker ──
    if (mm) {
      const ws4 = XLSX.utils.aoa_to_sheet([
        ["── INPUTS ──", ""],
        ["Fabric Width",      mm.fabric_width       ? `${mm.fabric_width} cm`        : ""],
        ["GSM",               mm.gsm                ? `${mm.gsm} g/m²`               : ""],
        ["Size Ratio",        mm.size_ratio         || ""],
        ["Marker Efficiency", mm.marker_efficiency  ? `${mm.marker_efficiency}%`      : ""],
        ["Wastage",           mm.wastage_pct        ? `${mm.wastage_pct}%`            : ""],
        ["Consumption",       mm.consumption        ? `${mm.consumption} m/pc`        : ""],
        ["CAD Ratio",         mm.cad_ratio          ? String(mm.cad_ratio)            : ""],
        ["Fabric Cost",       mm.fabric_cost        ? `${cur} ${mm.fabric_cost}/m`    : ""],
        [],
        ["── CALCULATED METRICS ──", ""],
        ["Total Fabric Required", mm.total_fabric_required ? `${mm.total_fabric_required} m/pc` : ""],
        ["Yield",                 mm.yield_value            != null ? String(mm.yield_value)     : ""],
        ["Fabric Utilization",    mm.fabric_utilization     ? `${mm.fabric_utilization}%`        : ""],
        ["Cost Per Piece",        mm.cost_per_piece         ? `${cur} ${mm.cost_per_piece}`       : ""],
        ["Status",                STATUS_LABELS[mm.status]  || mm.status],
      ]);
      ws4["!cols"] = [{ wch: 24 }, { wch: 32 }];
      XLSX.utils.book_append_sheet(wb, ws4, "Mini Marker");
    }

    // ── Sheet 5: Sampling ──
    if (samples.length) {
      const ws5 = XLSX.utils.aoa_to_sheet([
        ["Sample Type", "Status", "Submitted Date", "Approved Date", "Comments"],
        ...samples.map(s => [
          SAMPLE_LABELS[s.sample_type] || s.sample_type,
          STATUS_LABELS[s.status]      || s.status,
          s.submitted_date || "", s.approved_date || "", s.comments || "",
        ]),
      ]);
      ws5["!cols"] = [{ wch: 18 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(wb, ws5, "Sampling");
    }

    // ── Sheet 6: Style Sheet (technical) ──
    if (ss) {
      const ws6 = XLSX.utils.aoa_to_sheet([
        ["Fit Type",        ss.fit_type        || ""],
        ["Fabric Details",  ss.fabric_details  || ""],
        ["Wash Details",    ss.wash_details    || ""],
        ["Stitch Details",  ss.stitch_details  || ""],
        ["Label Placement", ss.label_placement || ""],
        ["Artwork Notes",   ss.artwork_notes   || ""],
        ["Packaging Notes", ss.packaging_notes || ""],
        ["Status",          STATUS_LABELS[ss.status] || ss.status],
      ]);
      ws6["!cols"] = [{ wch: 20 }, { wch: 70 }];
      XLSX.utils.book_append_sheet(wb, ws6, "Style Sheet");
    }

    XLSX.writeFile(wb, `${rfq.rfq_number}_Product_Sheet.xlsx`);
  };

  // ── loading / error ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#0B0F19" }}>
        <Loader2 size={36} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: "#6b7280", fontSize: 13 }}>Loading product sheet…</span>
        <style>{`@keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
      </div>
    );
  }
  if (!rfq) return null;

  const cur       = rfq.currency || "INR";
  const bomTotal  = bom?.items?.reduce((s, i) => s + (Number(i.cost) || 0), 0) || 0;
  const grandQty  = styles.reduce((s, st) => s + (st.total_quantity || 0), 0);

  return (
    <>
      {/* ── Global print CSS ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, html { background: white !important; }
          .print-wrap { background: white !important; padding: 0 !important; min-height: unset !important; }
          .print-doc  { box-shadow: none !important; border-radius: 0 !important;
                        max-width: 100% !important; width: 100% !important;
                        padding: 12mm 16mm !important; margin: 0 !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="no-print" style={{
        background: "#0F141D", padding: "13px 24px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: "1px solid #1E2533", position: "sticky", top: 0, zIndex: 50,
      }}>
        <button onClick={() => navigate(`/rfqs/${id}`)} style={{ display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
          <ArrowLeft size={15} /> Back to RFQ
        </button>
        <span style={{ color: "#374151" }}>·</span>
        <span style={{ color: "#6b7280", fontSize: 13 }}>{rfq.rfq_number} — Product Sheet</span>
        <div style={{ flex: 1 }} />
        <button onClick={handleExcel} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#1D2230", border: "1px solid #2A3142", borderRadius: 10, color: "#86efac", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
          <FileSpreadsheet size={14} /> Download Excel
        </button>
        <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#f97316", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      {/* ── Document ── */}
      <div className="print-wrap" style={{ background: "#0B0F19", minHeight: "calc(100vh - 50px)", padding: "32px 20px", display: "flex", justifyContent: "center" }}>
        <div className="print-doc" style={{
          background: "white", maxWidth: 900, width: "100%",
          borderRadius: 14, boxShadow: "0 8px 56px rgba(0,0,0,0.55)",
          padding: "44px 52px",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: "#111", fontSize: 13, lineHeight: 1.6,
        }}>

          {/* ══════════════════════════════════════════════
              SECTION 1 — HEADER
          ══════════════════════════════════════════════ */}
          <div style={{ borderBottom: "3px solid #f97316", paddingBottom: 22, marginBottom: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f97316", letterSpacing: "-0.02em" }}>STCH</div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1, letterSpacing: "0.06em", textTransform: "uppercase" }}>Product Specification Sheet</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#111" }}>{rfq.rfq_number}</div>
                {po && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{po.po_number}</div>}
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                  {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 6 }}>
                  <StatusBadge status={rfq.status} />
                  {po && <StatusBadge status={po.status} />}
                </div>
              </div>
            </div>

            {/* Summary chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0 28px", marginTop: 18 }}>
              {[
                { label: "Brand",     value: rfq.brand },
                { label: "Season",    value: rfq.season },
                { label: "Dept",      value: rfq.department },
                { label: "Garment",   value: rfq.garment_type },
                { label: "Priority",  value: rfq.priority },
                { label: "Supplier",  value: po?.supplier?.company_name },
              ].filter(x => x.value).map(({ label, value }) => (
                <div key={label} style={{ paddingRight: 28, borderRight: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginTop: 1 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 2 — COMMERCIAL SUMMARY (PO only)
          ══════════════════════════════════════════════ */}
          {po?.commercials && (
            <>
              <Divider title="Commercial Summary" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <CommercialTile label="Target Price"   value={money(po.commercials.target_price, cur)} />
                <CommercialTile label="Supplier Price" value={money(po.commercials.supplier_price, cur)} />
                <CommercialTile label="Margin"         value={money(po.commercials.margin, cur)} />
                <CommercialTile label="Profitability"  value={pct(po.commercials.profitability)} />
                <CommercialTile label="Total Amount"   value={money(po.commercials.total_amount, cur)} accent />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                <CommercialTile label="Order Quantity" value={qty(po.quantity)} />
                <CommercialTile label="Delivery Date"  value={po.delivery_date} />
                <CommercialTile label="Lead Time"      value={po.lead_time ? `${po.lead_time} days` : null} />
                <CommercialTile label="Payment Terms"  value={po.payment_terms} />
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 3 — GARMENT + ORDER SPECS
          ══════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
            <div>
              <Divider title="Garment Details" />
              <KVBlock cols={1} rows={[
                ["Fabric Type",  fmt(rfq.fabric_type)],
                ["Weight",       fmt(rfq.fabric_weight)],
                ["Composition",  fmt(rfq.fabric_composition)],
                ["Construction", fmt(rfq.construction)],
                ["Yarn Count",   fmt(rfq.yarn_count)],
              ]} />
            </div>
            <div>
              <Divider title="Order Details" />
              <KVBlock cols={1} rows={[
                ["Quantity",      qty(rfq.quantity)],
                ["Target Price",  money(rfq.target_price, cur)],
                ["Delivery Date", fmt(rfq.delivery_date)],
                ["Incoterms",     fmt(rfq.incoterms)],
                ["Category",      fmt(rfq.category)],
                ["Sub-Category",  fmt(rfq.sub_category)],
              ]} />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 4 — TRIMS + WASH
          ══════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
            <div>
              <Divider title="Trims & Accessories" />
              <KVBlock cols={1} rows={[
                ["Trims",     fmt(rfq.trims_details)],
                ["Packaging", fmt(rfq.packaging_type)],
                ["Label",     fmt(rfq.label_type)],
              ]} />
            </div>
            <div>
              <Divider title="Wash & Finish" />
              <KVBlock cols={1} rows={[
                ["Garment Wash",   (rfq.garment_wash || []).join(", ") || null],
                ["Dye Type",       fmt(rfq.dye_type)],
                ["Print Type",     fmt(rfq.print_type)],
                ["Embroidery",     fmt(rfq.embroidery_type)],
                ["Special Finish", fmt(rfq.special_finish)],
              ]} />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              SECTION 5 — COMPLIANCE
          ══════════════════════════════════════════════ */}
          {(rfq.compliance_standards?.length || rfq.testing_required?.length || rfq.social_compliance || rfq.quality_standards) && (
            <>
              <Divider title="Compliance & Testing" />
              <KVBlock cols={2} rows={[
                ["Standards",         (rfq.compliance_standards || []).join(", ") || null],
                ["Testing Required",  (rfq.testing_required || []).join(", ") || null],
                ["Social Compliance", fmt(rfq.social_compliance)],
                ["Quality Standards", fmt(rfq.quality_standards)],
              ]} />
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 6 — STYLE SHEET (technical spec)
          ══════════════════════════════════════════════ */}
          {ss && ss.status !== "NOT_STARTED" && (
            <>
              <Divider title="Style Sheet — Technical Specification" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
                <KVBlock cols={1} rows={[
                  ["Fit Type",        fmt(ss.fit_type)],
                  ["Stitch Details",  fmt(ss.stitch_details)],
                  ["Label Placement", fmt(ss.label_placement)],
                  ["Packaging Notes", fmt(ss.packaging_notes)],
                ]} />
                <KVBlock cols={1} rows={[
                  ["Fabric Details", fmt(ss.fabric_details)],
                  ["Wash Details",   fmt(ss.wash_details)],
                  ["Artwork Notes",  fmt(ss.artwork_notes)],
                ]} />
              </div>
              {(ss.front_image_url || ss.back_image_url) && (
                <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
                  {ss.front_image_url && (
                    <div style={{ textAlign: "center" }}>
                      <img src={ss.front_image_url} alt="Front" style={{ maxHeight: 200, maxWidth: 170, objectFit: "contain", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Front View</div>
                    </div>
                  )}
                  {ss.back_image_url && (
                    <div style={{ textAlign: "center" }}>
                      <img src={ss.back_image_url} alt="Back" style={{ maxHeight: 200, maxWidth: 170, objectFit: "contain", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Back View</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 7 — MINI MARKER
          ══════════════════════════════════════════════ */}
          {mm && mm.status !== "NOT_STARTED" && (
            <>
              <Divider title="Mini Marker — Fabric Engineering" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 52px" }}>
                <KVBlock cols={1} rows={[
                  ["Fabric Width",      mm.fabric_width      ? `${mm.fabric_width} cm`        : null],
                  ["GSM",               mm.gsm               ? `${mm.gsm} g/m²`               : null],
                  ["Size Ratio",        fmt(mm.size_ratio)],
                  ["Marker Efficiency", mm.marker_efficiency ? `${mm.marker_efficiency}%`      : null],
                  ["Wastage",           mm.wastage_pct       ? `${mm.wastage_pct}%`            : null],
                  ["Consumption",       mm.consumption       ? `${mm.consumption} m/pc`        : null],
                  ["CAD Ratio",         mm.cad_ratio         ? String(mm.cad_ratio)            : null],
                  ["Fabric Cost",       mm.fabric_cost       ? `${cur} ${mm.fabric_cost}/m`   : null],
                ]} />
                <div>
                  <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Calculated Metrics</div>
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 16px" }}>
                    {[
                      { label: "Total Fabric Required", value: mm.total_fabric_required ? `${mm.total_fabric_required} m/pc` : "—" },
                      { label: "Yield",                 value: mm.yield_value != null ? String(mm.yield_value) : "—" },
                      { label: "Fabric Utilization",    value: mm.fabric_utilization ? `${mm.fabric_utilization}%` : "—" },
                      { label: "Cost Per Piece",        value: mm.cost_per_piece ? `${cur} ${mm.cost_per_piece}` : "—", accent: true },
                    ].map(({ label, value, accent }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #fed7aa" }}>
                        <span style={{ fontSize: 11, color: "#92400e" }}>{label}</span>
                        <span style={{ fontSize: accent ? 15 : 12, fontWeight: accent ? 800 : 500, color: "#c2410c" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10 }}><StatusBadge status={mm.status} /></div>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 8 — STYLES, COLORS & SIZES
          ══════════════════════════════════════════════ */}
          {styles.length > 0 && (
            <>
              <Divider title={`Styles, Colors & Sizes · ${styles.length} Style${styles.length > 1 ? "s" : ""} · ${grandQty.toLocaleString("en-IN")} pcs total`} />

              {styles.map((style, si) => (
                <div key={style.id} style={{ marginBottom: 24, border: "1px solid #f3f4f6", borderRadius: 10, overflow: "hidden" }}>
                  {/* Style header */}
                  <div style={{ background: "#f9fafb", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>{style.style_name || `Style ${si + 1}`}</span>
                      <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: 8 }}>{style.style_code}</span>
                      {style.description && <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 12 }}>{style.description}</span>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 10, color: "#9ca3af" }}>Total </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{(style.total_quantity || 0).toLocaleString("en-IN")} pcs</span>
                    </div>
                  </div>

                  {/* Colors */}
                  {style.colors?.length > 0 ? (
                    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                      {style.colors.map((color) => {
                        const colorQty = color.sizes?.reduce((s, sz) => s + (sz.quantity || 0), 0) || 0;
                        return (
                          <div key={color.id} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                            {/* Color swatch + info */}
                            <div style={{ flexShrink: 0, width: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 8, background: color.hex_value || "#e5e7eb", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} />
                              <div style={{ fontSize: 11, fontWeight: 600, color: "#111", textAlign: "center" }}>{color.color_name}</div>
                              <div style={{ fontSize: 9, color: "#9ca3af" }}>{color.hex_value || color.color_code}</div>
                              <div style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{colorQty.toLocaleString("en-IN")} pcs</div>
                            </div>

                            {/* Size table */}
                            {color.sizes?.length > 0 && (
                              <table style={{ borderCollapse: "collapse", fontSize: 11 }}>
                                <thead>
                                  <tr>
                                    {color.sizes.map(sz => (
                                      <th key={sz.id} style={{ padding: "4px 12px", background: "#f9fafb", border: "1px solid #e5e7eb", fontSize: 10, fontWeight: 700, color: "#374151", minWidth: 50, textAlign: "center" }}>
                                        {sz.size_value}
                                      </th>
                                    ))}
                                    <th style={{ padding: "4px 12px", background: "#fff7ed", border: "1px solid #fed7aa", fontSize: 10, fontWeight: 700, color: "#92400e", textAlign: "center" }}>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {color.sizes.map(sz => (
                                      <td key={sz.id} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", textAlign: "center", fontWeight: 500, color: "#111" }}>
                                        {sz.quantity?.toLocaleString("en-IN") || 0}
                                      </td>
                                    ))}
                                    <td style={{ padding: "6px 12px", border: "1px solid #fed7aa", textAlign: "center", fontWeight: 700, color: "#c2410c", background: "#fffbf5" }}>
                                      {colorQty.toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )}

                            {/* Fabric image if uploaded */}
                            {color.fabric_image_path && (
                              <div style={{ flexShrink: 0 }}>
                                <img src={color.fabric_image_path} alt={color.color_name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>No colors added yet.</div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 9 — BILL OF MATERIALS (invoice style)
          ══════════════════════════════════════════════ */}
          {bom?.items?.length > 0 && (
            <>
              <Divider title="Bill of Materials" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#1f2937" }}>
                    {["#", "Material", "Type", "Consumption", "Unit", `Cost (${cur})`, "Supplier", "Remarks"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "#e5e7eb", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bom.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "7px 10px", color: "#9ca3af", fontSize: 10 }}>{i + 1}</td>
                      <td style={{ padding: "7px 10px", fontWeight: 600, color: "#111" }}>{item.material}</td>
                      <td style={{ padding: "7px 10px" }}>
                        <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 9, fontWeight: 700, background: "#eff6ff", color: "#1d4ed8" }}>{item.material_type}</span>
                      </td>
                      <td style={{ padding: "7px 10px", color: "#6b7280" }}>{item.consumption ?? "—"}</td>
                      <td style={{ padding: "7px 10px", color: "#6b7280" }}>{item.unit || "—"}</td>
                      <td style={{ padding: "7px 10px", fontWeight: 600, color: "#111" }}>{cur} {Number(item.cost || 0).toFixed(2)}</td>
                      <td style={{ padding: "7px 10px", color: "#6b7280" }}>{item.supplier || "—"}</td>
                      <td style={{ padding: "7px 10px", color: "#9ca3af", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#1f2937" }}>
                    <td colSpan={5} style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, color: "#e5e7eb", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Material Cost</td>
                    <td style={{ padding: "10px 10px", fontWeight: 900, fontSize: 15, color: "#fdba74" }}>{cur} {bomTotal.toFixed(2)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 10 — SAMPLING
          ══════════════════════════════════════════════ */}
          {samples.length > 0 && (
            <>
              <Divider title="Sampling Tracker" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Sample Type", "Status", "Submitted", "Approved", "Comments"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280", fontWeight: 700, borderBottom: "2px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {samples.map((s, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 600 }}>{SAMPLE_LABELS[s.sample_type] || s.sample_type}</td>
                      <td style={{ padding: "8px 10px" }}><StatusBadge status={s.status} /></td>
                      <td style={{ padding: "8px 10px", color: "#6b7280" }}>{s.submitted_date || "—"}</td>
                      <td style={{ padding: "8px 10px", color: "#6b7280" }}>{s.approved_date  || "—"}</td>
                      <td style={{ padding: "8px 10px", color: "#9ca3af" }}>{s.comments       || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ══════════════════════════════════════════════
              SECTION 11 — NOTES / TECH PACK
          ══════════════════════════════════════════════ */}
          {(rfq.notes || rfq.tech_pack_url) && (
            <>
              <Divider title="References & Notes" />
              <KVBlock cols={1} rows={[
                ["Tech Pack", fmt(rfq.tech_pack_url)],
                ["Notes",     fmt(rfq.notes)],
              ]} />
            </>
          )}

          {/* ── Footer ── */}
          <div style={{ marginTop: 48, paddingTop: 14, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 9, color: "#9ca3af", letterSpacing: "0.03em" }}>
              STCH · {rfq.rfq_number}{po ? ` / ${po.po_number}` : ""} · Generated {new Date().toLocaleDateString("en-IN")}
            </div>
            <div style={{ fontSize: 9, color: "#d1d5db", letterSpacing: "0.05em", textTransform: "uppercase" }}>Confidential</div>
          </div>

        </div>
      </div>
    </>
  );
}
