import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );
};

export { generateAccessToken, generateRefreshToken };
