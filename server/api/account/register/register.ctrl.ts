import { Request, Response } from "express";
import pool from "../../database";
import generateJWTToken from "../authorize/token";
const createAccount = (req: Request, res: Response) => {
  const { uid, nickname, email } = req.body;
  if (!uid || !nickname || !email)
    return res.status(400).json({ message: "Invalid Form Data" });
  pool.getConnection(async (err, con) => {
    if (err) throw new Error(err.message);
    con.query(
      "SELECT nickname FROM user_account WHERE `uid` = ? or `email` = ? or `nickname` = ?",
      [uid, email, nickname],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        else if (result[0] === nickname)
          return res.status(409).json({ message: "닉네임이 중복 되었습니다." });
        else if (result[0] >= 1)
          return res.status(409).json({ message: "이미 존재하는 계정입니다." });
      }
    );
    if (res.headersSent) {
      con.release();
      return;
    }
    const today = new Date();
    const date =
      today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    con.query(
      "INSERT INTO user_account VALUES(?,?,?,?,?)",
      [email, 0, uid, nickname, date],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        else {
          const { access_token, refresh_token } = generateJWTToken(result);
          res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 3,
          });
          res.status(201).json({ access_token, user: result });
        }
      }
    );
    con.commit();
    con.release();
  });
};

export { createAccount };
