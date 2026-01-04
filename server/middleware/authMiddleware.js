import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const protectAdmin = asyncHandler((req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded can carry { id, email }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
});
