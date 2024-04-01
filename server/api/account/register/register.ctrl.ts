import { Request, Response } from "express";
import pool from "../../database";
import { createHashedPassword } from "../authorize/password";
const createAccount = (req: Request, res: Response) => {
  const { id, password, nickname, email } = req.body;
  if (!id || !password || !nickname || !email)
    return res.status(400).json({ message: "Invalid Form Data" });
  pool.getConnection(async (err, con) => {
    if (err) throw new Error(err.message);
    con.query(
      "SELECT COUNT(*) FROM user_account WHERE id = ? or email = ? or nickname = ?",
      [id, email, nickname],
      (err, result) => {
        if (err) throw new Error(err.message);
        if (result) res.status(409).json({ message: "data already exists." });
        con.release();
      }
    );
    const { hashedPassword, salt } = await createHashedPassword(password);
    const today = new Date();
    const date =
      today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    // con.query("INSERT INTO user_account VALUES(?,?,?,?,?,?)", [
    //   id,
    //   hashedPassword,
    //   nickname,
    //   salt,
    //   email,
    //   date,
    // ]);
  });
};

export { createAccount };
