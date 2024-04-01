import express from "express";
import { loginByAccount } from "./login.ctrl";

const login = express.Router();
login.use(express.urlencoded({ extended: false }));
login.use(express.json());

login.post("/", loginByAccount);

export default login;
