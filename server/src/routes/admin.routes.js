import { Router } from "express";
import {
  setAdmin,
  backfillAdminFalse,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// In a real app, you would also check that the requester is an admin before allowing this.
router.post("/set-admin", requireAuth, setAdmin);
router.post("/backfill-admin-false", requireAuth, backfillAdminFalse);

export default router;
