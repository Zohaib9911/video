import User from "../models/User.js";

export async function setAdmin(req, res) {
  try {
    const { userId, admin } = req.body;
    if (!userId || typeof admin !== "boolean") {
      return res
        .status(400)
        .json({ error: "userId and admin(boolean) required" });
    }
    const updated = await User.findByIdAndUpdate(
      userId,
      { admin },
      { new: true, runValidators: true }
    ).select("_id name email admin");
    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function backfillAdminFalse(req, res) {
  try {
    const result = await User.updateMany(
      { $or: [{ admin: { $exists: false } }, { admin: { $eq: null } }] },
      { $set: { admin: false } }
    );
    return res.json({
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
