import jwt from 'jsonwebtoken';
import { JWT_ACCESS_EXPIRY, JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRY, JWT_REFRESH_SECRET } from '../config/constants.js';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  });
};

