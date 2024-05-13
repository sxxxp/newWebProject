import express from "express";
import { getJWTToken } from "../account/authorize/token";
import { findAllUser, findOneUser, findUserByNickname } from "./user.ctrl";

const user = express.Router();

user.get("/", findAllUser);
user.get("/nickname/:nickname", findUserByNickname);
user.get("/:id", findOneUser);
user.post("/token", getJWTToken);
export default user;
