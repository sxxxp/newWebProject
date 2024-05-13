import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token;
  if (!access_token)
    return next(res.status(401).json({ message: "액세스 토큰이 없습니다." }));
  const verifyAccessToken = jwt.verify(
    access_token,
    process.env.ACCESS_SECRET_KEY as jwt.Secret
  );
  if (!verifyAccessToken)
    return next(
      res.status(401).json({ message: "인증 불가능한 액세스 토큰입니다." })
    );
  next();
};

export { verifyAccessToken };
