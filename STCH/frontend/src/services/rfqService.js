import api from "./api";

export const createRFQ = async (payload) => {
  return api.post("/rfqs", payload);
};

export const getRFQs = async () => {
  return api.get("/rfqs");
};

export const getRFQById = async (id) => {
  return api.get(`/rfqs/${id}`);
};