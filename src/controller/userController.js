import UserModel from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtHelper.js";
import { userRegisterValidationSchema } from "../schema/userSchema.js";
import Joi from "joi";
import jwt from "jsonwebtoken";

export const currentUser = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      data: null,
      errorType: "UNAUTHORIZED",
    });
  }
  try {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errorType: "USER_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      message: "User found",
      data: user,
      errorType: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      errorType: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const register = async (req, res) => {
  const { error, value } = userRegisterValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      data: null,
      errorType: "VALIDATION_ERROR",
    });
  }

  const {
    fullName,
    username,
    email,
    password,
    date_of_birth,
    gender,
    country,
  } = value;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).lean();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
        errorType: "USER_ALREADY_EXISTS",
      });
    }
    const user = await UserModel.create({
      fullName,
      username,
      email,
      password,
      date_of_birth,
      gender,
      country,
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await UserModel.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.json({
      success: true,
      message: "User registered successfully",
      data: { id: user._id, fullName, username, email },
      errorType: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      errorType: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
      data: null,
      errorType: "USERNAME_EMAIL_REQUIRED",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
      data: null,
      errorType: "PASSWORD_REQUIRED",
    });
  }

  // Validate email or username
  if (email) {
    const { error } = Joi.string().pattern(emailRegex).validate(email);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
        data: null,
        errorType: "INVALID_EMAIL",
      });
    }
  }
  if (username) {
    const { error } = Joi.string().validate(username);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
        data: null,
        errorType: "INVALID_USERNAME",
      });
    }
  }

  try {
    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    }).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errorType: "USER_NOT_FOUND",
      });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
        data: null,
        errorType: "INVALID_PASSWORD",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    await UserModel.findByIdAndUpdate(user._id, { refreshToken });

    res.json({
      success: true,
      message: "User logged in successfully",
      data: null,
      errorType: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      errorType: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errorType: "USER_NOT_FOUND",
      });
    }
    user.refreshToken = null;
    await UserModel.findByIdAndUpdate(user._id, { refreshToken: null });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({
      success: true,
      message: "User logged out successfully",
      data: null,
      errorType: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      errorType: "INTERNAL_SERVER_ERROR",
    });
  }
};
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token",
      data: null,
      errorType: "NO_REFRESH_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decoded.id).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errorType: "USER_NOT_FOUND",
      });
    }
    const isRefreshTokenValid = await user.verifyRefreshToken(refreshToken);
    if (!isRefreshTokenValid) {
      return res.status(401).json({
        success: false,
        message: "Refresh token mismatch",
        data: null,
        errorType: "INVALID_REFRESH_TOKEN",
      });
    }

    const accessToken = generateAccessToken(user);
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.json({
      success: true,
      message: "Access token generated successfully",
      data: null,
      errorType: null,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
      data: null,
      errorType: "INVALID_REFRESH_TOKEN",
    });
  }
};

export const findUser = async (req, res) => {
  const { username, email } = req.query;
  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
      data: null,
      errorType: "VALIDATION_ERROR",
    });
  }
  try {
    const user = await UserModel.findOne({
      $or: [{ username }, { email }],
    }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        errorType: "USER_NOT_FOUND",
      });
    }
    res.json({
      success: true,
      message: "User found",
      data: user,
      errorType: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      errorType: "INTERNAL_SERVER_ERROR",
    });
  }
};
