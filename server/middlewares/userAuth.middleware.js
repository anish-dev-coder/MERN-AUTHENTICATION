import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.json({
        success: false,
        message: "Token not Provided please login",
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_KEY);

    if (decodeToken) {
      req.userToken = decodeToken;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized please Login",
      });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
