import * as admin from "firebase-admin";

const serviceAccountKey = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: credential.cert(serviceAccountKey),
});

export const verifyFirebaseToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Please provide the token" });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((verifiedToken) => {
      req.user = verifiedToken;
      next();
    })
    .catch((error) => {
      console.error(error);
      return res.status(401).send({ message: "Invalid token" });
    });
};
