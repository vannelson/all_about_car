const AUTH_STORAGE_KEY = "user";

export function getPersistedAuth() {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Persisted state stores { auth: {...} }
    return parsed?.auth ?? parsed ?? null;
  } catch {
    return null;
  }
}

export function getActiveCompanyIdFromAuth(authState) {
  if (!authState) return null;
  const user =
    authState?.user ??
    authState?.profile?.user ??
    authState?.profile?.data?.user ??
    null;

  if (!user) return null;

  return (
    user?.active_company?.id ??
    user?.activeCompany?.id ??
    user?.company_id ??
    user?.companyId ??
    null
  );
}

export function getActiveCompanyId() {
  const auth = getPersistedAuth();
  return getActiveCompanyIdFromAuth(auth);
}

export { AUTH_STORAGE_KEY };
