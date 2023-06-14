import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export { generateAccessToken, generateRefreshToken };
