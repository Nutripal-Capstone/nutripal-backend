import axios from "axios";

let tokenInfo = {};

const getAccessToken = async (res) => {
  const { FATSECRET_CLIENT_ID, FATSECRET_CLIENT_SECRET } = process.env;

  try {
    const response = await axios({
      method: "POST",
      url: 'https://oauth.fatsecret.com/connect/token',
      headers: { "content-type": "application/x-www-form-urlencoded" },
      auth: {
        username: FATSECRET_CLIENT_ID,
        password: FATSECRET_CLIENT_SECRET,
      },
      data: "grant_type=client_credentials&scope=premier",
    });

    tokenInfo = response.data;
    tokenInfo.retrieved_at = Date.now();
  } catch (error) {
    return res.status(500).json({
        success: false,
        data: null,
        message: "Error getting fatsecret access token.",
      });
  }
};

const validateAccessToken = async (req, res, next) => {
  if (
    !tokenInfo.access_token ||
    Date.now() > tokenInfo.retrieved_at + tokenInfo.expires_in * 1000
  ) {
    await getAccessToken(res);
  }
  req.accessToken = tokenInfo.access_token;
  next();
};

export default validateAccessToken;
