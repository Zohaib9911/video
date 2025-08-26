import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "ims_token";

export function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.[COOKIE_NAME] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
