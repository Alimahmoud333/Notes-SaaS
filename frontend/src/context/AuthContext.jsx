import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // LOGIN
  const login = async (data) => {
    const res = await API.post("/login", data);

    localStorage.setItem("token", res.data.token);

    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);

    return res.data;
  };

  // REGISTER
  const register = async (data) => {
    const res = await API.post("/register", data);

    return res.data;
  };

  // VERIFY OTP
  const verifyOtp = async (data) => {
    const res = await API.post("/verify-otp", data);

    return res.data;
  };

  // RESEND OTP
  const resendOtp = async (data) => {
    const res = await API.post("/resend-otp", data);

    return res.data;
  };

  // FORGOT PASSWORD
  const forgotPassword = async (data) => {
    const res = await API.post("/forgot-password", data);

    return res.data;
  };



  // LOGOUT
  const logout = async () => {
    try {
      await API.post("/logout");
    } catch {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        logout,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
