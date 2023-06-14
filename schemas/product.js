import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Trường tên sản phẩm là bắt buộc",
  }),
  thumb: Joi.string().trim().messages({
    "string.empty": "Ảnh đại diện sản phẩm không được để trống",
  }),
  images: Joi.array().items(Joi.string()).messages({
    "array.base": "Ảnh sản phẩm phải là một mảng",
    "string.empty": "Ảnh sản phẩm không được để trống",
  }),
  price: Joi.number().required().messages({
    "number.empty": "Giá sản phẩm không được để trống",
    "any.required": "Trường giá sản phẩm là bắt buộc",
  }),
  description: Joi.string().trim().messages({
    "string.empty": "Mô tả sản phẩm không được để trống",
  }),
  categoryId: Joi.string().trim().required().messages({
    "string.empty": "Danh mục sản phẩm không được để trống",
    "any.required": "Trường danh mục sản phẩm là bắt buộc",
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.empty": "Tên sản phẩm không được để trống",
  }),
  thumb: Joi.string().trim().messages({
    "string.empty": "Ảnh đại diện sản phẩm không được để trống",
  }),
  images: Joi.array().items(Joi.string()).messages({
    "array.base": "Ảnh sản phẩm phải là một mảng",
    "string.empty": "Ảnh sản phẩm không được để trống",
  }),
  price: Joi.number().messages({
    "number.empty": "Giá sản phẩm không được để trống",
  }),
  description: Joi.string().trim().messages({
    "string.empty": "Mô tả sản phẩm không được để trống",
  }),
  categoryId: Joi.string().trim().messages({
    "string.empty": "Danh mục sản phẩm không được để trống",
  }),
});
