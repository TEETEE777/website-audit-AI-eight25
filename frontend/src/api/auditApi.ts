import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const auditWebsite = (url: string) =>
  api.post("/audit", { url });

export const getAudits = () =>
  api.get("/audits");

export const getAudit = (id: number) =>
  api.get(`/audits/${id}`);

export const deleteAudit = (id: number) =>
  api.delete(`/audits/${id}`);