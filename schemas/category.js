import joi from "joi";

export const categorySchema = joi.object({
    name: joi.string().trim().required().messages({
        "string.empty": "Name không được để trống",
    }),
    image: joi.string().trim().required().messages({
        "string.empty": "Image không được để trống",
    })
});