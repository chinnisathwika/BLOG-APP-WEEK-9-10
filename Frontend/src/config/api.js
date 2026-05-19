const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
