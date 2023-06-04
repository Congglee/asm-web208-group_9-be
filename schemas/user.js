import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên không được để trống",
    "any.required": "Trường tên là bắt buộc",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không đúng định dạng",
    "any.required": "Trường email là bắt buộc",
  }),
  password: Joi.string().trim().required().min(6).messages({
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Trường mật khẩu là bắt buộc",
  }),
  confirmPassword: Joi.string()
    .trim()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "string.empty": "Xác nhận mật khẩu không được để trống",
      "any.required": "Trường xác nhận mật khẩu là bắt buộc",
      "any.only": "Xác nhận mật khẩu không khớp",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
    "string.email": "Email không đúng định dạng",
  }),
  password: Joi.string().trim().required().min(6).messages({
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Trường mật khẩu là bắt buộc ",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Tên không được để trống",
  }),
  email: Joi.string().trim().email().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không đúng định dạng",
  }),
  password: Joi.string().trim().min(6).messages({
    "string.min": "Password phải có ít nhất {#limit} ký tự",
    "string.empty": "Password không được để trống",
  }),
});
