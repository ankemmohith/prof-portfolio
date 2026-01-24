import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup({ name, email, password, role: "user" });
      navigate("/");
    } catch (e2) {
      setErr(e2.message || "Sign up failed");
    }
  };

  return (
    <main>
      <div className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-md rounded-2xl border p-6">
          <h1 className="text-2xl font-bold">Sign up</h1>
          {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="text" placeholder="Full name" autoComplete="name"
              className="w-full rounded-xl border px-3 py-2"
              value={name} onChange={(e)=>setName(e.target.value)} required
            />
            <input
              type="email" placeholder="Email" autoComplete="email"
              className="w-full rounded-xl border px-3 py-2"
              value={email} onChange={(e)=>setEmail(e.target.value)} required
            />
            <input
              type="password" placeholder="Password" autoComplete="new-password"
              className="w-full rounded-xl border px-3 py-2"
              value={password} onChange={(e)=>setPassword(e.target.value)} required
            />
            <button className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Create account
            </button>
          </form>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link className="text-amber-500 hover:underline" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
