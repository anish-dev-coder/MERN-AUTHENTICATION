import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/register.model.js";
import transporter from "../confing/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../confing/emailTemplates.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "All Filed is Required! " });
  }
  try {
    const isExistUser = await userModel.findOne({ email });
    if (isExistUser) {
      return res.json({ success: false, message: "User already exist!" });
    }
    const hashPasswword = await bcrypt.hash(password, 10);

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Authentication System ",
      text: `Welcome to Authentication System Your account has been created with email id: ${email}`,
    };
    const sendMail = await transporter.sendMail(mailOptions);
    if (sendMail) {
      const user = new userModel({
        name,
        email,
        password: hashPasswword,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
      });
      res.json({
        success: true,
        message: "Registration Successfully!",
      });
    } else {
      res.json({ success: false, message: "Server Erorr!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Server Erorr!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All Filed is Required! " });
  }

  try {
    const isExistUser = await userModel.findOne({ email });
    if (!isExistUser) {
      return res.json({ success: false, message: "Invalid Login Details" });
    }
    const isMatchPassword = await bcrypt.compare(
      password,
      isExistUser.password
    );
    if (!isMatchPassword) {
      return res.json({ success: false, message: "Invalid Login Details" });
    }

    const token = jwt.sign({ id: isExistUser._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
    });

    res.json({ success: true, message: "Login Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
    });
    res.json({ success: true, message: "Logout Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userToken;

    const user = await userModel.findById(userId.id);

    if (user.isVerified) {
      res.json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP ",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    const sendMail = await transporter.sendMail(mailOptions);
    if (sendMail) {
      res.json({
        success: true,
        message: "Account Verification OTP sent on Email",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.userToken;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details!" });
  }
  try {
    const user = await userModel.findById(userId.id);
    if (!user) {
      return res.json({ success: false, message: "user not Found!" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP Please Try Again...",
      });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Time is Expired!" });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    user.save();
    return res.json({ success: true, message: "Email Verified Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is Required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not Found!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP ",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    const sendMail = await transporter.sendMail(mailOptions);
    if (sendMail) {
      res.json({
        success: true,
        message: "Reset Password OTP sent on Email",
      });
    } else {
      res.json({
        success: false,
        message: "check your internet connection ",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.json({
      success: false,
      message: "Email, OTP, New Password is Required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not Found!" });
    }

    if ((user.resetOtp = "" || user.resetOtp !== otp)) {
      return res.json({ success: false, message: "invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Time is Expired!" });
    }
    const hashPasswword = await bcrypt.hash(password, 10);
    user.password = hashPasswword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    user.save();
    return res.json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
