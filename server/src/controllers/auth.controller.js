import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = process.env.COOKIE_NAME || "ims_token";
const COOKIE_SECURE = process.env.NODE_ENV === "production";

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    setAuthCookie(res, token);
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      isadmin: user.isadmin,
    });
  } catch (err) {
    console.error("signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    setAuthCookie(res, token);
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      isadmin: user.isadmin,
    });
  } catch (err) {
    console.error("signin error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function signout(req, res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  return res.json({ ok: true });
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select(
      "_id name email admin isadmin"
    );
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
