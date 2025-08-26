import { Router } from "express";
import { signin, signup, signout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/me", requireAuth, me);

export default router;
