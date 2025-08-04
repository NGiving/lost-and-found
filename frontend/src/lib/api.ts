import axios from "axios";
import type { Item } from "../types/items";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export async function fetchItems() {
  const response = await api.get<Item[]>("/items", { withCredentials: true });
  return response.data;
}


export default api;
