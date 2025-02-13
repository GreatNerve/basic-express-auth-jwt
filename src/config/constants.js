import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '30s';
export const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
export const COOKIE_SECRET = process.env.COOKIE_SECRET;


