import { apiRequest } from "./api";

export async function loginApi({ email, password }) {
  const path = "/login";
  const payload = { email, password };
  // Backend requires POST
  const res = await apiRequest(path, { method: "POST", body: payload });
  return res;
}

export async function registerApi({ name, email, password, password_confirmation, type, role }) {
  const res = await apiRequest("/users", {
    method: "POST",
    body: { name, email, password, password_confirmation, type, role },
  });
  return res;
}
