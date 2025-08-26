import React, { useState } from "react";
import { api } from "../../serverApi";

export default function SignUp({ onSwitchToSignIn, onSignedUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!name || !email || !password) {
        throw new Error("Please fill all fields");
      }
      const user = await api.signup({ name, email, password });
      setLoading(false);
      onSignedUp(user);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Unable to sign up");
    }
  };

  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
        <p className="text-sm text-gray-600 mt-1">Join to start meetings</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your name"
            />
          </div>
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToSignIn}
            className="text-purple-600 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
