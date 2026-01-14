import userModel from "../models/register.model.js";

export const getUserDetail = async (req, res) => {
  try {
    const userId = req.userToken;

    const user = await userModel.findById(userId.id);
    if (!user) {
      return res.json({ success: false, message: "User not Found!" });
    }
    res.json({
      success: true,
      userData: { name: user.name, isVerified: user.isVerified },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
