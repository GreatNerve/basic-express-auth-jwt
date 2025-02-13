import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { emailRegex, passwordRegex } from "../schema/userSchema.js";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlenght: 255,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      index: true,
      unique: true,
      minlenght: 3,
      maxlenght: 255,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: emailRegex,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      maxlenght: 50,
      match: passwordRegex,
      select: false,
    },
    date_of_birth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password?.length < 8)
    throw new Error("Password must be at least 8 characters long");
  if (this.password.length > 50)
    throw new Error("Password must be at most 50 characters long");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const user = await UserModel.findById(this._id).select("password");
  if (!user) throw new Error("User not found");
  return bcrypt.compare(password, user.password);
};

userSchema.methods.verifyRefreshToken = async function (refreshToken) {
  const user = await UserModel.findById(this._id).select("refreshToken");
  if (!user) throw new Error("User not found");
  return refreshToken === user.refreshToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
