import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const BASE = import.meta.env.VITE_APP_BASE_URL;

export const getAssignments = () =>
  apiConnector("GET", `${BASE}/assignment/all`);

export const getAssignmentById = (id) =>
  apiConnector("GET", `${BASE}/assignment/${id}`);

export const submitAssignment = (data) =>
  apiConnector("POST", `${BASE}/assignment/submit`, data);
