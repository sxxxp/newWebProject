import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../../types";
import pool from "../../database";

dotenv.config({ path: "../../.env" });
const findJWTToken = (uid: string) => {
  pool.getConnection((err, con) => {
    if (err) throw new Error(err.message);
    con.query(
      "SELECT token FROM refresh_token WHERE id = ?",
      [uid],
      (err, result) => {
        if (err) throw new Error(err.message);
      }
    );
  });
};
const generateJWTToken = (user: IUser) => {
  console.log(user);
  const access_key = process.env.ACCESS_SECRET_KEY;
  const refresh_key = process.env.REFRESH_SECRET_KEY;
  if (!access_key || !refresh_key) throw new Error("no secret key");
  const access_token = jwt.sign(
    { id: user.uid, role: user.role, type: "access_token" },
    access_key,
    {
      algorithm: "HS256",
      expiresIn: "30m",
    }
  );
  const refresh_token = jwt.sign(
    { id: user.uid, role: user.role, type: "refresh_token" },
    refresh_key,
    {
      algorithm: "HS256",
      expiresIn: "3d",
    }
  );
  pool.getConnection((err, con) => {
    if (err) {
      con.release();
      throw new Error(err.message);
    }
    con.query(
      "SELECT COUNT(*) as count FROM refresh_token WHERE id = ?",
      [user.uid],
      (err, result) => {
        if (err) {
          con.release();
          throw new Error(err.message);
        }
        if (result[0].count === 1) {
          con.query(
            "UPDATE refresh_token SET token = ? WHERE id = ?",
            [refresh_token, user.uid],
            (err, result) => {
              con.release();
              if (err) {
                throw new Error(err.message);
              }
              con.commit();
            }
          );
        } else {
          con.query(
            "INSERT INTO refresh_token VALUES(?, ?)",
            [user.uid, refresh_token],
            (err, result) => {
              con.release();
              if (err) {
                throw new Error(err.message);
              }
              con.commit();
            }
          );
        }
      }
    );
  });
  return { access_token, refresh_token };
};

export default generateJWTToken;
