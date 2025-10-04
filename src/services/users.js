import { apiRequest } from "./api";

// Create a new user (borrower) record
// Expects: { first_name, middle_name, last_name, email, password, password_confirmation, type, role }
export async function createUserApi({ first_name, middle_name, last_name, email, password, password_confirmation, type = "user", role = "member" }) {
  const body = {
    first_name,
    middle_name,
    last_name,
    email,
    password,
    password_confirmation: password_confirmation ?? password,
    type,
    role,
  };
  const res = await apiRequest("/users", { method: "POST", body });
  return res; // expect { data: { id, ... } } or similar
}

