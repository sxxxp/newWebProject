import express from "express";
import { findAllUser, findOneUser, findUserByNickname } from "./user.ctrl";

const user = express.Router();

user.get("/", findAllUser);
user.get("/nickname/:nickname", findUserByNickname);
user.get("/:id", findOneUser);

export default user;
