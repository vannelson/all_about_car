import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import carsReducer from "./carsSlice";

const PERSIST_KEY = "user";

function loadState() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function saveState(state) {
  try {
    const toSave = JSON.stringify({ auth: state.auth });
    localStorage.setItem(PERSIST_KEY, toSave);
  } catch {
    // ignore write errors
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export const selectAuth = (state) => state.auth;
