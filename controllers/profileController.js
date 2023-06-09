import prisma from "../config/prisma.js";

export const getProfile = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await prisma.user.findUnique({
            where: {
              id: userId
            },
          });
        res.status(200).json({
            "success": true,
            "data" : user,
            "message" : "Get profile user successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: { error: error.message },
            message: "Error fetching profile data.",
          });
    }
}

export const updateProfile = async (req, res) => {
    const newData = req.body
    try {
        const user = await prisma.user.update({
            where:{id: req.user.id},
            data: newData
        })
        res.status(200).json({
            "success": true,
            "data" : user,
            "message" : "Update profile user successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: { error: error.message },
            message: "Error update profile data.",
          });
    }
}