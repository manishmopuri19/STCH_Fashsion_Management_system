import API from "../api/axios";

export const getAllCatalogues = () => API.get("/catalogues/");
export const createCatalogue = (data) => API.post("/catalogues/", data);
export const updateCatalogue = (id, data) => API.patch(`/catalogues/${id}`, data);
export const deleteCatalogue = (id) => API.delete(`/catalogues/${id}`);
