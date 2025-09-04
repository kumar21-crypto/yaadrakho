import React, { createContext, useEffect, useContext, useState } from "react";
import { account } from "../lib/appwrite";

const Ctx = createContext();

export function AuthProvider ({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const me = await account.get();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (email , password) => account.createEmailPasswordSession({
    email: email,
    password: password
  });

  const signup = (email, password, name) => account.create({
    userId: "unique()",
    email: email,
    password: password,
    name:name
  });

  const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (err) {
    // Ignore 401 errors (already logged out)
    if (err.code !== 401) {
      console.error(err);
    }
  } finally {
    setUser(null);
    // Optionally, redirect to login page if using react-router
    window.location.href = "/login";
  }
};

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
