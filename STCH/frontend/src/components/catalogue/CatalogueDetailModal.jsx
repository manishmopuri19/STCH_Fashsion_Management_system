import { X, Package, Clock, IndianRupee, Layers, Edit2, Trash2, Tag } from "lucide-react";

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-3 items-start">
      <span className="text-zinc-500 text-sm w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-zinc-200 text-sm">{value}</span>
    </div>
  );
}

function CatalogueDetailModal({ item, onClose, onEdit, onDelete, canManage }) {
  if (!item) return null;

  const hasImage =
    item.image_url &&
    (item.image_url.startsWith("http") || item.image_url.startsWith("/"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#11151D] border border-[#2A3142] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* HERO IMAGE */}
        <div className="relative h-64 bg-[#151821] rounded-t-3xl overflow-hidden flex-shrink-0">
          {hasImage ? (
            <img
              src={item.image_url}
              alt={item.product_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={64} className="text-zinc-700" />
            </div>
          )}

          {/* Gradient overlay so text above the image is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11151D] via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
          >
            <X size={16} />
          </button>

          {item.category && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Tag size={11} />
              {item.category}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* TITLE ROW */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white text-2xl font-bold leading-tight">{item.product_name}</h2>
              <p className="text-zinc-500 text-sm mt-1">{item.garment_type}</p>
            </div>

            {canManage && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(item)}
                  className="w-9 h-9 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all"
                  title="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="w-9 h-9 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>

          {/* KEY VALUES */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1D2230] border border-[#2A3142] rounded-2xl p-4 text-center">
              <Package size={18} className="text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-500 text-xs mb-1">MOQ</p>
              <p className="text-white font-bold text-lg">
                {item.moq != null ? item.moq.toLocaleString() : "—"}
              </p>
              <p className="text-zinc-600 text-xs mt-0.5">units</p>
            </div>

            <div className="bg-[#1D2230] border border-[#2A3142] rounded-2xl p-4 text-center">
              <IndianRupee size={18} className="text-orange-500 mx-auto mb-2" />
              <p className="text-zinc-500 text-xs mb-1">Target Price</p>
              <p className="text-orange-400 font-bold text-lg">
                {item.target_price != null
                  ? `₹${Number(item.target_price).toFixed(2)}`
                  : "—"}
              </p>
              <p className="text-zinc-600 text-xs mt-0.5">per unit</p>
            </div>

            <div className="bg-[#1D2230] border border-[#2A3142] rounded-2xl p-4 text-center">
              <Clock size={18} className="text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-500 text-xs mb-1">Lead Time</p>
              <p className="text-white font-bold text-lg">{item.lead_time || "—"}</p>
              <p className="text-zinc-600 text-xs mt-0.5">days</p>
            </div>
          </div>

          {/* STYLE & MATERIAL SECTION */}
          <div className="bg-[#1D2230] border border-[#2A3142] rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-4">
              <Layers size={15} className="text-orange-500" />
              Style &amp; Material
            </h3>
            <DetailRow label="Fabric Type" value={item.fabric_type} />
            <DetailRow label="Composition" value={item.fabric_composition} />
            <DetailRow label="GSM" value={item.gsm ? `${item.gsm} GSM` : null} />
            <DetailRow label="Wash Type" value={item.wash_type} />
            <DetailRow label="Print Type" value={item.print_type} />
            <DetailRow label="Embroidery" value={item.embroidery_type} />
          </div>

          {/* DESCRIPTION */}
          {item.description && (
            <div>
              <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{item.description}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-[#2A3142] text-zinc-400 hover:text-white hover:bg-[#1D2230] transition-all text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatalogueDetailModal;
