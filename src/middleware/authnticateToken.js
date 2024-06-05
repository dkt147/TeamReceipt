import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../Config/index.js";
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
    req.user = user;
    next();
  });
}

export default authenticateToken;
