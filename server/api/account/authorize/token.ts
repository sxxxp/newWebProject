import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../../types";
import pool from "../../database";
import { NextFunction, Request, Response } from "express";
import { calluser, User } from "../../user/user.ctrl";
dotenv.config({ path: "../../.env" });
interface AccessPayload {
  uid: string;
  type: "refresh_token";
  iat: number;
  exp: number;
}
const parseCookie = (str: string) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {} as any);
const getJWTToken = (req: Request, res: Response) => {
  if (req.headers.cookie) {
    const cookies = parseCookie(req.headers.cookie);
    let access_data, refresh_data: AccessPayload;
    if (cookies.access_token) {
      try {
        access_data = jwt.verify(
          cookies.access_token,
          process.env.ACCESS_SECRET_KEY!
        ) as AccessPayload;
      } catch (e) {
        return res.status(400).json({ message: "Invaild Token" });
      }
      calluser(access_data.uid).then((user) => {
        return res.status(200).json({
          user: new User(user),
          access_token: cookies.access_token,
          message: "success",
        });
      });
      return;
    }
    console.log(cookies);
    if (!cookies) return res.status(404).json({ message: "Token Not Found" });

    try {
      refresh_data = jwt.verify(
        cookies.refresh_token,
        process.env.REFRESH_SECRET_KEY!
      ) as AccessPayload;
    } catch (e) {
      return res.status(400).json({ message: "Invaild Token" });
    }

    const { access_token, refresh_token } = generateJWTToken(refresh_data);
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
    calluser(refresh_data.uid).then((user) => {
      return res
        .status(200)
        .json({ user: new User(user), access_token, message: "success" });
    });
  } else {
    res.status(404).json({ message: "Cookie Not Found" });
  }
};
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
const generateJWTToken = (user: IUser | AccessPayload) => {
  const access_key = process.env.ACCESS_SECRET_KEY;
  const refresh_key = process.env.REFRESH_SECRET_KEY;
  if (!access_key || !refresh_key) throw new Error("no secret key");
  else if (!user) throw new Error("no user Data");
  const access_token = jwt.sign(
    { uid: user.uid, type: "access_token" },
    access_key,
    {
      algorithm: "HS256",
      expiresIn: "30m",
    }
  );
  const refresh_token = jwt.sign(
    { uid: user.uid, type: "refresh_token" },
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
export { getJWTToken };
export default generateJWTToken;
