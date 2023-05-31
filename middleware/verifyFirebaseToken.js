import admin from "../config/firebaseAdmin.js";

const verifyFirebaseToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Please provide the token.",
    });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((verifiedToken) => {
      req.user = verifiedToken;
      next();
    })
    .catch((error) => {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid token.",
      });
    });
};

export default verifyFirebaseToken;
