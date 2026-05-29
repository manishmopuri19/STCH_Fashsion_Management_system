import { Edit2, Trash2, Eye, Package, Clock, IndianRupee } from "lucide-react";

function CatalogueCard({ item, onView, onEdit, onDelete, canManage }) {
  const hasImage =
    item.image_url &&
    (item.image_url.startsWith("http") || item.image_url.startsWith("/"));

  return (
    <div className="bg-[#1D2230] border border-[#2A3142] rounded-3xl overflow-hidden group hover:border-orange-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col">

      {/* IMAGE */}
      <div className="relative h-52 bg-[#151821] overflow-hidden flex-shrink-0">
        {hasImage ? (
          <img
            src={item.image_url}
            alt={item.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback placeholder — shown when no valid image */}
        <div
          className={`w-full h-full items-center justify-center ${
            hasImage ? "hidden" : "flex"
          }`}
        >\
          <Package size={48} className="text-zinc-700" />
        </div>

        {/* CATEGORY BADGE */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
            {item.category}
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="flex flex-col flex-1 p-5 space-y-4">

        {/* PRODUCT NAME + GARMENT TYPE */}
        <div>
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-1">
            {item.product_name}
          </h3>
          <p className="text-zinc-500 text-sm mt-0.5">{item.garment_type}</p>
        </div>

        {/* STYLE CHIPS — fabric, wash, gsm */}
        <div className="flex flex-wrap gap-1.5">
          {item.fabric_type && (
            <span className="text-xs bg-[#283041] text-zinc-300 border border-[#2A3142] px-2 py-0.5 rounded-lg">
              {item.fabric_type}
            </span>
          )}
          {item.wash_type && (
            <span className="text-xs bg-[#283041] text-zinc-300 border border-[#2A3142] px-2 py-0.5 rounded-lg">
              {item.wash_type}
            </span>
          )}
          {item.gsm && (
            <span className="text-xs bg-[#283041] text-zinc-300 border border-[#2A3142] px-2 py-0.5 rounded-lg">
              {item.gsm} GSM
            </span>
          )}
        </div>

        {/* VALUES ROW — MOQ / Price / Lead Time */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2A3142]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-zinc-600 text-xs mb-1">
              <Package size={10} />
              MOQ
            </div>
            <p className="text-white font-semibold text-sm">
              {item.moq != null ? item.moq.toLocaleString() : "—"}
            </p>
          </div>

          <div className="text-center border-x border-[#2A3142]">
            <div className="flex items-center justify-center gap-1 text-zinc-600 text-xs mb-1">
              <IndianRupee size={10} />
              Price
            </div>
            <p className="text-orange-400 font-semibold text-sm">
              {item.target_price != null
                ? `₹${Number(item.target_price).toFixed(2)}`
                : "—"}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-zinc-600 text-xs mb-1">
              <Clock size={10} />
              Lead
            </div>
            <p className="text-white font-semibold text-sm">
              {item.lead_time != null ? `${item.lead_time}d` : "—"}
            </p>
          </div>
        </div>

        {/* ACTION ROW */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onView(item)}
            className="flex-1 py-2 rounded-xl bg-[#283041] border border-[#2A3142] text-zinc-300 text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all flex items-center justify-center gap-2"
          >
            <Eye size={13} />
            View Details
          </button>

          {canManage && (
            <>
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded-xl bg-[#283041] border border-[#2A3142] text-zinc-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                title="Edit"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 rounded-xl bg-[#283041] border border-[#2A3142] text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CatalogueCard;
