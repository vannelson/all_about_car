import { apiRequest } from "./api";

export async function loginApi({ email, password }) {
  const path = "/login";
  const payload = { email, password };
  // Backend requires POST
  const res = await apiRequest(path, { method: "POST", body: payload });
  return res;
}

export async function registerApi({ first_name, middle_name, last_name, email, password, password_confirmation, type, role, name }) {
  // For compatibility, if backend still supports `name`, send both.
  const fullName = name || [first_name, middle_name, last_name].filter(Boolean).join(" ");
  const body = {
    first_name,
    middle_name,
    last_name,
    name: fullName || undefined,
    email,
    password,
    password_confirmation,
    type,
    role,
  };
  const res = await apiRequest("/users", { method: "POST", body });
  return res;
}
