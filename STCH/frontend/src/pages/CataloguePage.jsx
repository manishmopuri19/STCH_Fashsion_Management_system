import { Plus, Search, Filter, BookOpen, Layers3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { useCatalogue } from "../hooks/useCatalogue";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import CatalogueFormModal from "../components/catalogue/CatalogueFormModal";
import CatalogueDetailModal from "../components/catalogue/CatalogueDetailModal";

function CataloguePage() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const hook = useCatalogue();

  // Handle delete flow: close detail modal first, then show confirm
  const handleDeleteClick = (id) => {
    hook.setDetailItem(null);
    hook.confirmDelete(id);
  };

  // Handle edit flow: close detail modal first, then open form
  const handleEditFromDetail = (item) => {
    hook.setDetailItem(null);
    hook.openEditModal(item);
  };

  const content = (
    <CatalogueContent
      canManage={canManage}
      hook={hook}
      onDeleteClick={handleDeleteClick}
    />
  );

  return (
    <>
      {/* Logged-in users get the full sidebar layout;
          unauthenticated visitors get a minimal public header */}
      {user ? (
        <DashboardLayout>{content}</DashboardLayout>
      ) : (
        <PublicShell>{content}</PublicShell>
      )}

      {/* CREATE / EDIT MODAL */}
      <CatalogueFormModal
        open={hook.formModalOpen}
        onClose={() => hook.setFormModalOpen(false)}
        formData={hook.formData}
        onChange={hook.handleFormChange}
        onSubmit={hook.submitForm}
        submitting={hook.submitting}
        editItem={hook.editItem}
      />

      {/* DETAIL MODAL */}
      <CatalogueDetailModal
        item={hook.detailItem}
        onClose={() => hook.setDetailItem(null)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteClick}
        canManage={canManage}
      />

      {/* DELETE CONFIRM DIALOG */}
      {hook.deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#11151D] border border-[#2A3142] rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <p className="text-white font-semibold text-lg mb-2">Delete this item?</p>
            <p className="text-zinc-400 text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={hook.cancelDelete}
                className="flex-1 py-2.5 rounded-xl border border-[#2A3142] text-zinc-400 hover:text-white hover:bg-[#1D2230] transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => hook.handleDelete(hook.deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Inner content component ────────────────────────────────────────────────
// Receives everything it needs via props so it can be placed inside any
// layout wrapper without caring about where it lives in the tree.
function CatalogueContent({ canManage, hook, onDeleteClick }) {
  const {
    loading,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    categories,
    filteredCatalogues,
    setDetailItem,
    openCreateModal,
    openEditModal,
  } = hook;

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <BookOpen size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Catalogue</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-[52px]">
            {loading
              ? "Loading…"
              : `${filteredCatalogues.length} garment${filteredCatalogues.length !== 1 ? "s" : ""} available`}
          </p>
        </div>

        {canManage && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-105"
          >
            <Plus size={18} />
            Add New
          </button>
        )}
      </div>

      {/* SEARCH + CATEGORY FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, category, garment type…"
            className="w-full bg-[#1D2230] border border-[#2A3142] rounded-2xl pl-11 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="relative">
          <Filter size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1D2230] border border-[#2A3142] rounded-2xl pl-11 pr-10 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none min-w-[160px]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CATALOGUE GRID */}
      {loading ? (
        // Skeleton loading state
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-[#1D2230] border border-[#2A3142] rounded-3xl h-80 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCatalogues.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center mb-4">
            <Layers3 size={28} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 font-medium">No catalogue items found</p>
          <p className="text-zinc-600 text-sm mt-1">
            {search || categoryFilter !== "ALL"
              ? "Try adjusting your search or filter"
              : canManage
              ? 'Click "Add New" to create your first item'
              : "The catalogue is empty"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCatalogues.map((item) => (
            <CatalogueCard
              key={item.id}
              item={item}
              canManage={canManage}
              onView={setDetailItem}
              onEdit={openEditModal}
              onDelete={onDeleteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Minimal layout for unauthenticated visitors ────────────────────────────
function PublicShell({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      <header className="border-b border-[#2A3142] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">STCH Catalogue</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-all"
        >
          Login
        </button>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

export default CataloguePage;
