const SERVER_BASE_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${SERVER_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data?.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export const api = {
  signin: (payload) =>
    request("/api/auth/signin", { method: "POST", body: payload }),
  signup: (payload) =>
    request("/api/auth/signup", { method: "POST", body: payload }),
  signout: () => request("/api/auth/signout", { method: "POST" }),
  me: () => request("/api/auth/me"),
};

export default api;
