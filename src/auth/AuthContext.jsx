import React from "react";

/** Very small localStorage user store for dev.
 * Shape: { name, email, role: 'admin'|'user', password }
 */
function loadUsers() {
  try { return JSON.parse(localStorage.getItem("users") || "[]"); } catch { return []; }
}
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }

// Seed a default admin (change to your prof’s email)
const SEED_ADMIN = {
  name: "Prof. Navrati Saxena",
  email: "navrati.saxena@sjsu.edu",
  password: "navrati",  // dev only; replace later
  role: "admin"
};

const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("sessionUser") || "null"); } catch { return null; }
  });
  const [editMode, setEditMode] = React.useState(false);

  // Seed admin (one-time)
  React.useEffect(() => {
    const users = loadUsers();
    if (!users.find(u => u.email === SEED_ADMIN.email)) {
      users.push(SEED_ADMIN);
      saveUsers(users);
    }
  }, []);

  const signup = async ({ name, email, password, role = "user" }) => {
    const users = loadUsers();
    if (users.some(u => u.email === email)) throw new Error("Email already exists");
    const newUser = { name, email, password, role };
    users.push(newUser); saveUsers(users);
    setUser({ name, email, role });
    localStorage.setItem("sessionUser", JSON.stringify({ name, email, role }));
  };

  const login = async ({ email, password }) => {
    const users = loadUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    setUser({ name: found.name, email: found.email, role: found.role });
    localStorage.setItem("sessionUser", JSON.stringify({ name: found.name, email: found.email, role: found.role }));
  };

  const logout = () => {
    setUser(null);
    setEditMode(false);
    localStorage.removeItem("sessionUser");
  };

  const value = {
    user,
    isAdmin: !!user && user.role === "admin",
    editMode,
    setEditMode,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
