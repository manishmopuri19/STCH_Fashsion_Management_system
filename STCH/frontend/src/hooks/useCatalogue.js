import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllCatalogues,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
} from "../services/catalogueService";

// Default blank form — kept outside the hook so it's a stable reference
// and never triggers re-renders just by being referenced
const EMPTY_FORM = {
  product_name: "",
  category: "",
  garment_type: "",
  fabric_type: "",
  fabric_composition: "",
  gsm: "",
  wash_type: "",
  print_type: "",
  embroidery_type: "",
  moq: "",
  target_price: "",
  lead_time: "",
  image_url: "",
  description: "",
};

export function useCatalogue() {
  // ── useState ──────────────────────────────────────────────────────────
  // Each piece of independent state gets its own useState so React can
  // batch and skip re-renders for state that hasn't changed.
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter state — drives useMemo below
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal visibility and which item is in context
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Controlled form state for the create/edit modal
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation — holds the id of the item pending deletion (or null)
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── useEffect ─────────────────────────────────────────────────────────
  // Run once on mount: fetch the catalogue list from the backend.
  // Empty dependency array [] ensures this never re-runs.
  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async () => {
    try {
      setLoading(true);
      const res = await getAllCatalogues();
      setCatalogues(res.data);
    } catch {
      setCatalogues([]);
    } finally {
      setLoading(false);
    }
  };

  // ── useMemo ───────────────────────────────────────────────────────────
  // Derive the unique category list from the raw catalogues array.
  // useMemo caches the result and only recomputes when `catalogues` changes,
  // preventing an expensive Set-construction on every render.
  const categories = useMemo(
    () => [...new Set(catalogues.map((c) => c.category).filter(Boolean))],
    [catalogues]
  );

  // Derive the visible subset by applying search + category filter.
  // Only recomputes when catalogues, search, or categoryFilter change.
  const filteredCatalogues = useMemo(() => {
    const q = search.toLowerCase();
    return catalogues.filter((item) => {
      const matchesSearch =
        !q ||
        item.product_name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.garment_type?.toLowerCase().includes(q) ||
        item.fabric_type?.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [catalogues, search, categoryFilter]);

  // ── useCallback ───────────────────────────────────────────────────────
  // Stable function references: without useCallback these would be recreated
  // on every render, causing every child component that receives them as
  // props to also re-render unnecessarily.

  const openCreateModal = useCallback(() => {
    setEditItem(null);
    setFormData(EMPTY_FORM);
    setFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((item) => {
    setEditItem(item);
    setFormData({
      product_name: item.product_name ?? "",
      category: item.category ?? "",
      garment_type: item.garment_type ?? "",
      fabric_type: item.fabric_type ?? "",
      fabric_composition: item.fabric_composition ?? "",
      gsm: item.gsm ?? "",
      wash_type: item.wash_type ?? "",
      print_type: item.print_type ?? "",
      embroidery_type: item.embroidery_type ?? "",
      moq: item.moq ?? "",
      target_price: item.target_price ?? "",
      lead_time: item.lead_time ?? "",
      image_url: item.image_url ?? "",
      description: item.description ?? "",
    });
    setFormModalOpen(true);
  }, []);

  // Single onChange handler for the entire form — name attribute on the
  // input drives which formData key gets updated.
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handles both create and update depending on whether editItem is set.
  const submitForm = useCallback(async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        moq: parseInt(formData.moq) || 0,
        target_price: parseFloat(formData.target_price) || 0,
        lead_time: parseInt(formData.lead_time) || 0,
      };

      if (editItem) {
        await updateCatalogue(editItem.id, payload);
      } else {
        await createCatalogue(payload);
      }

      await fetchCatalogues();
      setFormModalOpen(false);
      setEditItem(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [formData, editItem]);

  const confirmDelete = useCallback((id) => setDeleteConfirm(id), []);
  const cancelDelete = useCallback(() => setDeleteConfirm(null), []);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteCatalogue(id);
        await fetchCatalogues();
        if (detailItem?.id === id) setDetailItem(null);
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteConfirm(null);
      }
    },
    [detailItem]
  );

  return {
    catalogues,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredCatalogues,
    formModalOpen,
    setFormModalOpen,
    detailItem,
    setDetailItem,
    editItem,
    formData,
    handleFormChange,
    openCreateModal,
    openEditModal,
    submitForm,
    submitting,
    confirmDelete,
    cancelDelete,
    deleteConfirm,
    handleDelete,
  };
}
