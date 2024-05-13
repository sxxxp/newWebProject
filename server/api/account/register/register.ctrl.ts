import { Request, Response } from "express";
import pool from "../../database";
import generateJWTToken from "../authorize/token";
let status: number = 0;
let message: string = "";
const createAccount = (req: Request, res: Response) => {
  const { uid, nickname, email } = req.body;
  if (!uid || !nickname || !email)
    return res.status(400).json({ message: "Invalid Form Data" });

  pool.getConnection((err, con) => {
    if (err) throw new Error(err.message);
    con.query(
      "SELECT nickname FROM user_account WHERE `uid` = ? or `email` = ? or `nickname` = ?",
      [uid, email, nickname],
      (err, result) => {
        if (!result[0]) return;
        if (err) {
          status = 500;
          message = err.message;
        } else if (result[0]) {
          console.log(result[0]);
          status = 409;
          message = "이미 존재하는 계정입니다.";
        } else if (result[0]["nickname"] === nickname) {
          status = 409;
          message = "닉네임이 중복 되었습니다.";
        }
      }
    );
    console.log(status, message);
    if (status !== 0 && message !== "") {
      con.release();
      return res.status(status).json({ message });
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
          res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 30,
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
