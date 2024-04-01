import { Request, Response } from "express";
import { calluser, handleCallUserError } from "../../user/user.ctrl";
import generateJWTToken from "../authorize/token";

const loginByAccount = async (req: Request, res: Response) => {
  if (!req.body || !req.body.id)
    return res.status(400).json({ message: "Invalid Request Form" });
  try {
    const user = await calluser(req.body.id);
    res.json(generateJWTToken(user));
  } catch (e) {
    const { code, message } = handleCallUserError(e);
    res.status(code).json(message);
  }
};

export { loginByAccount };
