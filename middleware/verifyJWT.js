import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ success: false, data: null, message: "Invalid token." });
  }
};

export default verifyJWT;
