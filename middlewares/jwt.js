import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "60s" }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" }
  );
};

export { generateAccessToken, generateRefreshToken };
