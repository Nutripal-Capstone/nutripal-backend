import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const uid = req.user.uid;

  const user = await prisma.user.findUnique({
    where: {
      firebaseId: uid,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "User is not yet registered.",
    });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return res.status(200).json({
    success: true,
    data: {
      token,
    },
    message: "Login successful.",
  });
};
