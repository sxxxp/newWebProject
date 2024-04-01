import express from "express";
import login from "./account/login";

import user from "./user";

const router = express.Router();

router.use("/user", user);
router.use("/login", login);
export default router;
