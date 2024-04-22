import express from "express";
import { loginByAccount } from "./login.ctrl";

const login = express.Router();

login.post("/", loginByAccount);

export default login;
