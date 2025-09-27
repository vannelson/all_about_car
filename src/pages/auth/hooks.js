import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { loginApi, registerApi } from "../../services/auth";
import { loginSuccess, registerSuccess } from "../../store/authSlice";

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
      const derivedRole = apiUser?.type || apiUser?.role || "borrower";

      dispatch(
        loginSuccess({
          user: {
            name: apiUser?.name || (email ? email.split("@")[0] : "User"),
            email: apiUser?.email || email,
          },
          role: derivedRole,
          token,
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

export function useRegisterHandler({ name, email, password }) {
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
      await registerApi({ name, email, password, password_confirmation: password, type, role });
      const loginRes = await loginApi({ email, password });
      const apiUser = loginRes?.data?.user || loginRes?.user || {};
      const token = loginRes?.data?.token || loginRes?.token;
      const derivedRole = apiUser?.type || apiUser?.role || type;

      dispatch(
        registerSuccess({
          user: { name: apiUser?.name || name, email: apiUser?.email || email },
          role: derivedRole,
          token,
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

