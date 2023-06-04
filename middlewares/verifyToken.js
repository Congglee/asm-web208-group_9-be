import jwt from "jsonwebtoken";

const verifyAccessToken = async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
        });

      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Require authentication!",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  if (role === false)
    return res.status(401).json({
      success: false,
      message: "Require Admin Role",
    });

  next();
};

export { verifyAccessToken, isAdmin };
