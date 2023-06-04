import joi from "joi";
export const productSchema = joi.object({
    name: joi.string().trim().required().messages({
        "string.empty": "Name không được để trống",
    }),
    price: joi.number().trim().required().messages({
        "string.empty": "Price không được để trống",
    }),
    image: joi.string().trim().required().messages({
        "string.empty": "Image không được để trống",
    }),
    description: joi.string().trim().messages({
        "string.empty": "Description không được để trống",
    }),
    categoryId: joi.string().trim().required().messages({
        "string.empty": "Email không được để trống",
    }),
});