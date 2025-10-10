import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { loginApi, registerApi } from "../../services/auth";
import { loginSuccess, registerSuccess } from "../../store/authSlice";

const normalizeUserPayload = (apiUser = {}, { email: fallbackEmail = null, name: fallbackName = null } = {}) => {
  const activeCompany = apiUser?.active_company || apiUser?.activeCompany || null;
  const nameFromParts = [apiUser?.first_name, apiUser?.middle_name, apiUser?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const derivedEmail = apiUser?.email || fallbackEmail || null;
  const derivedName =
    nameFromParts ||
    apiUser?.name ||
    fallbackName ||
    (derivedEmail ? derivedEmail.split("@")[0] : "User");

  return {
    ...apiUser,
    email: derivedEmail,
    name: derivedName,
    display_name: derivedName,
    active_company: activeCompany,
    company_id: apiUser?.company_id ?? apiUser?.companyId ?? activeCompany?.id ?? null,
  };
};

export function useLoginHandler({ email, password }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const apiUser = res?.data?.user || res?.user || {};
      const token = res?.data?.token || res?.token;
      const normalizedUser = normalizeUserPayload(apiUser, { email });
      const derivedRole = normalizedUser?.type || normalizedUser?.role || "borrower";

      dispatch(
        loginSuccess({
          user: normalizedUser,
          role: derivedRole,
          token,
          profile: res?.data || null,
        })
      );

      toast({ title: "Welcome", description: res?.message || "Login successful", status: "success" });
      navigate(derivedRole === "tenant" ? "/tenant/dashboard" : "/borrower/payments", { replace: true });
    } catch (err) {
      const msg = err?.data?.message || err?.response?.data?.message || err.message;
      toast({ title: "Login failed", description: msg, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
}

export function useRegisterHandler({ firstName, middleName, lastName, email, password, confirmPassword }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // Static for now per requirements
  const type = "borrower";
  const role = "user";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        toast({ title: "Passwords do not match", status: "error" });
        setLoading(false);
        return;
      }
      await registerApi({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword || password,
        type,
        role,
      });
      const loginRes = await loginApi({ email, password });
      const apiUser = loginRes?.data?.user || loginRes?.user || {};
      const token = loginRes?.data?.token || loginRes?.token;
      const fallbackName = [firstName, middleName, lastName].filter(Boolean).join(" ") || null;
      const normalizedUser = normalizeUserPayload(apiUser, { email, name: fallbackName });
      const derivedRole = normalizedUser?.type || normalizedUser?.role || type;

      dispatch(
        registerSuccess({
          user: normalizedUser,
          role: derivedRole,
          token,
          profile: loginRes?.data || null,
        })
      );

      toast({ title: "Welcome", description: "Account created", status: "success" });
      navigate(derivedRole === "tenant" ? "/tenant/dashboard" : "/borrower/payments", { replace: true });
    } catch (err) {
      const msg = err?.data?.message || err?.response?.data?.message || err.message;
      toast({ title: "Registration failed", description: msg, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
}
