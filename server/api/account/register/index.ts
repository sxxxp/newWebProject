import express from "express";
import { createAccount } from "./register.ctrl";

const register = express.Router();

register.put("/", createAccount);

export default register;
