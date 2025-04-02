// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { getAuthData, storeAuthData, clearAuthData } from "../utils/storage";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth data on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const data = await getAuthData();
        setAuthData(data);
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Login function
  const login = async (data) => {
    try {
      await storeAuthData(data);
      setAuthData(data);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await clearAuthData();
      setAuthData(null);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  // Context value
  const value = {
    authData,
    isAuthenticated: !!authData,
    loading,
    login,
    logout,
    // Helper getters for common values
    projectId: authData?.projectId || null,
    promoterId: authData?.promoterId || null,
    vendorId: authData?.vendorId || null,
    token: authData?.token || null,
    societyId: authData.societyId || null,
    societyName: authData.societyName || null,
    activityId: authData.activityId || null,
    cityId: authData.cityId || null,
    cityName: authData.cityName || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
