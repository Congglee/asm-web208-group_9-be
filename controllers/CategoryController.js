import joi from "joi";
import Category from "../models/category";
import Product from "../models/product";
import slugify from "slugify";

const createCategory = async (req, res) => {
  try {
    const newCategorySlug = slugify(req.body.name, { lower: true });
    const newCategory = await Category.create({
      ...req.body,
      slug: newCategorySlug,
    });

    return res.json({
      success: newCategory ? true : false,
      createdCategory: newCategory
        ? newCategory
        : "Thêm danh mục sản phẩm không thành công",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select(
      "name _id image slug products"
    );

    return res.json({
      success: categories ? true : false,
      categories: categories ? categories : "Không lấy được danh mục sản phẩm",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("products");
    const products = await Product.find({ categoryId: req.params.id });

    return res.json({
      success: category ? true : false,
      productCategory: category
        ? { ...category.toObject(), products }
        : "Không lấy được danh mục sản phẩm",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error?.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }
    await Product.updateMany(
      { categoryId: category._id },
      { $set: { categoryId: null } }
    );

    const uncategorized = await Category.findOne({ name: "uncategorized" });
    if (!uncategorized) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục uncategorized",
      });
    }
    await Product.updateMany(
      { categoryId: null },
      { $set: { categoryId: uncategorized._id } }
    );

    await category.remove();
    return res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateCategorySlug = slugify(req.body.name, { lower: true });
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { ...req.body, slug: updateCategorySlug },
      {
        new: true,
      }
    );

    return res.json({
      success: updatedCategory ? true : false,
      updatedCategory: updatedCategory
        ? updatedCategory
        : "Cập nhật danh mục thất bại",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: message.error,
    });
  }
};

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
