import { Request, Response } from "express";
import { MysqlError } from "mysql";
import pool from "../database";
import { IUser } from "../types";

const findAllUser = (req: Request, res: Response) => {
  pool.getConnection((err, con) => {
    if (err) throw new Error(err.stack);
    con.query(
      "SELECT * FROM user_info",
      (err: MysqlError | null, result: Array<IUser>) => {
        if (err) throw new Error(err.stack);
        res.json(result);
        con.release();
      }
    );
  });
};
const calluser = (id: string): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if (err) reject(new Error(err.message));
      con.query(
        "SELECT * FROM user_account WHERE email = ?",
        [id],
        (err, result: Array<IUser>) => {
          if (err) reject(new Error(err.message));
          if (!result[0]) reject(new Error("no content"));
          else {
            resolve(result[0]);
          }
        }
      );
      con.release();
    });
  });
};

const handleCallUserError = (e: any) => {
  if (e.message == "no content") {
    return { code: 204, message: e.message };
  } else {
    return { code: 500, message: e.message };
  }
};

const findOneUser = async (req: Request, res: Response) => {
  try {
    res.json(await calluser(req.params.id));
  } catch (e: any) {
    const { code, message } = handleCallUserError(e);
    res.status(code).json(message);
  }
};

const findUserByNickname = (req: Request, res: Response) => {
  pool.getConnection((err, con) => {
    if (err) throw new Error(err.stack);
    con.query(
      "SELECT * FROM user_info WHERE nickname = ?",
      [req.params.nickname],
      (err, result: Array<IUser>) => {
        if (err) throw new Error(err.stack);
        if (!result[0]) res.status(204).send("No Data");
        else {
          con.release();
          res.json(result[0]);
        }
      }
    );
  });
};

const deleteUser = (req: Request, res: Response) => {};

export {
  findAllUser,
  findOneUser,
  findUserByNickname,
  calluser,
  handleCallUserError,
};
