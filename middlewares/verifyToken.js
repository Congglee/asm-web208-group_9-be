import jwt from "jsonwebtoken";

const verifyAccessToken = async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Access token không hợp lệ",
        });

      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập!",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  if (role === false)
    return res.status(401).json({
      success: false,
      message: "Yêu cầu quyền admin",
    });

  next();
};

export { verifyAccessToken, isAdmin };
