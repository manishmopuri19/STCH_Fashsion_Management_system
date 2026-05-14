import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData) return null;

  const cleanedUser = { ...userData };

  // Convert:
  // "UserRole.ADMIN" -> "ADMIN"
  // "UserRole.MEMBER" -> "MEMBER"

  if (cleanedUser.role?.includes(".")) {
    cleanedUser.role = cleanedUser.role.split(".")[1];
  }

  // Safety cleanup
  cleanedUser.role = cleanedUser.role?.trim().toUpperCase();

  // Fallback username
  cleanedUser.userName =
    cleanedUser.userName ||
    cleanedUser.email?.split("@")[0] ||
    "User";

  return cleanedUser;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

    return normalizeUser(JSON.parse(savedUser));
  });

  const login = (userData) => {
    const cleanedUser = normalizeUser(userData);

    localStorage.setItem("user", JSON.stringify(cleanedUser));

    setUser(cleanedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);