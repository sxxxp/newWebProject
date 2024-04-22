import express from "express";
import login from "./account/login";
import register from "./account/register";

import user from "./user";

const router = express.Router();

router.use("/user", user);
router.use("/login", login);
router.use("/register", register);
export default router;
