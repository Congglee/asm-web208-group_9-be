import joi from "joi";

export const categorySchema = joi.object({
    name: joi.string().trim().required().messages({
        "string.empty": "Name không được để trống",
    }),
    image: joi.string().trim().required().messages({
        "string.empty": "Image không được để trống",
    })
});
// lấy toàn bộ Category
export const getAllCate = async(req, res) => {
    try {
        const categories = await Category.find({});
        if (!categories) {
            return res.json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        return res.json({
            message: "Lấy sản phẩm thành công",
            categories,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
// lấy theo id category
export const getCate = async(req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate("products");
        if (!category) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        return res.json(category);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
// thêm tên category
export const createCate = async(req, res) => {
    try {
        // validate
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const category = await Category.create(req.body);
        if (!category) {
            return res.json({
                message: "Thêm danh mục không thành công",
            });
        }
        return res.json({
            message: "Thêm danh mục thành công",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
// delete category
export const removeCate = async(req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
                return res.status(404).json({
                    message: "Không tìm thấy danh mục",
                });
            }
            const deletedProducts = await Product.deleteMany({ categoryId: category._id });
            return res.status(200).json({
                message: "Xóa danh mục và sản phẩm thành công",
                category,
                deletedProducts,
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message,
            })
        }
    }
    // update category
export const updateCate = async(req, res) => {
    try {

        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body);
        if (category.length === 0) {
            return res.status(400).json({
                message: "cập nhật thất bại"
            })
        }
        return res.status(200).json({
            message: "cập nhật thành công",
            category,
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
}