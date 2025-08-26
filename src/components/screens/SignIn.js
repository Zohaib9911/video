import React, { useState } from "react";
import { api } from "../../serverApi";

export default function SignIn({ onSwitchToSignUp, onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error("Please enter email and password");
      }
      const user = await api.signin({ email, password });
      setLoading(false);
      onSignedIn(user);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Unable to sign in");
    }
  };

  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome back</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={onSwitchToSignUp}
            className="text-purple-600 hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
