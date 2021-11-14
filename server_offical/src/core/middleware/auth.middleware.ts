import { DataStoredInToken } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({ message: "Empty token" });
  }
  try {
    const user = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET!
    ) as DataStoredInToken;

    if (!req.user) req.user = { id: "" };

    req.user.id = user.id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }

 
};

export default authMiddleware;
