import { Request, Response } from "express";
import { calluser, handleCallUserError, User } from "../../user/user.ctrl";
import generateJWTToken from "../authorize/token";

const loginByAccount = async (req: Request, res: Response) => {
  console.log(req.body);
  if (!req.body || !req.body.uid) {
    return res.status(400).json({ message: "Invalid Request Form" });
  }
  try {
    const user = await calluser(req.body.uid);
    const { access_token, refresh_token } = generateJWTToken(user);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 30,
    });
    new User(user);
    return res.status(200).json({ access_token, message: "success" });
  } catch (e) {
    const { code, message } = handleCallUserError(e);
    res.status(code).json(message);
  }
};

export { loginByAccount };
