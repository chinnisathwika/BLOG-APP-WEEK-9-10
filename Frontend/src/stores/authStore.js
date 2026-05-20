import { create } from "zustand";
import axios from "axios";
import { apiUrl } from "../config/api";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  login: async (userCredWithRole) => {
    try {
      //set loading true
      set({ loading: true, error: null });
      //make api call
      let res = await axios.post(apiUrl("/common-api/login"), userCredWithRole, { withCredentials: true });
      // console.log("res is ", res);
      //update state
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload, //{message:"",payload:}
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        //error: err,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      //set loading state
      set({ loading: true, error: null });
      //make logout api req
      await axios.get(apiUrl("/common-api/logout"), { withCredentials: true });
      //update state
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },
  // restore login
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(apiUrl("/common-api/check-auth"), { withCredentials: true });
      const user = res.data.payload || null;

      set({
        currentUser: user,
        isAuthenticated: Boolean(user),
        loading: false,
        error: null,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.error || err.response?.data?.message || "Auth check failed",
      });
    }
  },
}));
