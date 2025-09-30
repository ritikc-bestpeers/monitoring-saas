import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

const JWT_SECRET = CONFIG.JWT_SECRET; 
const JWT_EXPIRES_IN = CONFIG.JWT_EXPIRES_IN;

export const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  console.log("payload: ", payload)
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
}

export const decodeToken = (token) => {
  return jwt.decode(token);
}