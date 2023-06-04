import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { valid } from "joi";
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin", success: false });
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "Email đã được sử dụng!", success: false });
    }
    // Mã hóa password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await new User({
      name,
      email,
      password: hashPassword,
    });
    const user = await newUser.save();
    return res
      .status(200)
      .json({ user, message: "Tạo tài khoản thành công!", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Tạo tài khoản thất bại! " + error.message,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Khong duoc bo trong !" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Email không đúng!" });
    }
    const { password: hashPassword } = await user;

    const validPassword = await bcrypt.compare(password, hashPassword);

    if (!validPassword)
      return res.status(403).json({ success: false, message: "Sai mật khẩu!" });

    if (user && validPassword) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      user.password = undefined;
      return res.status(200).json({
        message: "Đăng nhập thành công!",
        user,
        accessToken,
      });
    }
  } catch (error) {
    return res.status(500).status({
      message: "Dang nhap that bai!" + error.message,
      success: false,
    });
  }
};

const logOut = async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Đăng xuất thành công!" });
};

const getUserId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ message: "Id không tồn tại" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "Sản phẩm không có!", success: false });
  }
  return res.status(200).json({ message: "San pham ne!", user });
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(401).json({
        success: true,
        message: "Danh sách trống!",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server: " + error.message, success: false });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "id không tồn tại!" });
    const userId = await User.findById(id);
    if (!userId)
      return res.status(401).json({ message: "User không tồn tại!" });

    const user = await User.deleteOne({ id });

    if (user)
      return res
        .status(200)
        .json({ message: "Xóa sản phẩm thành công", success: true, user });
  } catch (error) {
    return res.status(500).json({
      message: "Xóa người dùng thất bại!" + error.message,
      success: false,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({
        message: "Vui lòng không được để trống các trường!",
        success: false,
      });
    const checkEmail = await User.findOne({ email });
    if (checkEmail)
      return res.status(401).json({
        message: "Vui lòng nhập lại email khác!",
        success: false,
        checkEmail,
      });
    const newUser = await User.updateOne(
      {
        _id: req.params.id,
      },
      { name, email }
    );
    if (newUser)
      return res.status(200).json({
        message: "Cập nhật tài khoản thành công!",
        success: false,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Update User thất bại!" + error.message,
      success: false,
    });
  }
};
export {
  register,
  login,
  logOut,
  getUserId,
  getAllUsers,
  deleteUser,
  updateUser,
};
