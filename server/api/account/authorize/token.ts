import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../../types";

dotenv.config({ path: "../../.env" });

const generateJWTToken = (user: IUser) => {
  const access_key = process.env.ACCESS_SECRET_KEY;
  const refresh_key = process.env.REFRESH_SECRET_KEY;
  if (!access_key || !refresh_key) throw new Error("no secret key");
  const access_token = jwt.sign(
    { id: user.id, role: user.role, type: "access_token" },
    access_key,
    {
      algorithm: "HS256",
      expiresIn: "30m",
    }
  );
  const refresh_token = jwt.sign(
    { id: user.id, role: user.role, type: "refresh_token" },
    refresh_key,
    {
      algorithm: "HS256",
      expiresIn: "7d",
    }
  );
  return { access_token, refresh_token };
};

export default generateJWTToken;
