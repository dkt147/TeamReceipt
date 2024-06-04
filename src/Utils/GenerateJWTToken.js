import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../Config/index.js";

const generateAccessToken = (userData) => {
  const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    username: userData.username,
    password: userData.password,
  };
  console.log(user);
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
  return accessToken;
};

export default generateAccessToken;
