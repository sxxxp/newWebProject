import { Request, Response } from "express";
import { calluser, handleCallUserError } from "../../user/user.ctrl";
import generateJWTToken from "../authorize/token";

const loginByAccount = async (req: Request, res: Response) => {
  console.log(req.body);
  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: "Invalid Request Form" });
  }
  try {
    const user = await calluser(req.body.email);
    const { access_token, refresh_token } = generateJWTToken(user);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
    return res.status(200).json({ user, access_token });
  } catch (e) {
    const { code, message } = handleCallUserError(e);
    res.status(code).json(message);
  }
};

export { loginByAccount };
