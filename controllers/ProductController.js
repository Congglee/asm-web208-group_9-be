import Product from "../models/product";
import { Types } from "mongoose";
import Category from "../models/category";
import slugify from "slugify";
import { createProductSchema, updateProductSchema } from "../schemas/product";

const createProduct = async (req, res) => {
  try {
    const { error } = createProductSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((errItem) => errItem.message);

      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    // Kiểm tra tên sản phẩm trùng với tên sản phẩm nào trong db
    const productName = req.body.name;
    const existingProduct = await Product.findOne({
      name: { $regex: productName, $options: "i" },
    });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message:
          "Sản phẩm có cùng tên đã tồn tại, vui lòng nhập lại tên sản phẩm",
      });
    }

    const newProduct = await Product.create(req.body);

    // Lấy ra mảng file có file là thumb từ req.files
    const thumbFiles = req.files["thumb"];
    // Lấy ra mảng file có file là images từ req.files
    const imageFiles = req.files["images"];

    if (thumbFiles && thumbFiles.length > 0) {
      newProduct.thumb = thumbFiles[0].path;
    }

    if (imageFiles && imageFiles.length > 0) {
      newProduct.images = imageFiles.map((file) => file.path);
    }

    await newProduct.save();

    return res.status(200).json({
      success: newProduct ? true : false,
      createdProduct: newProduct ? newProduct : "Thêm mới sản phẩm thất bại",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { error } = updateProductSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((errItem) => errItem.message);
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    const { id } = req.params;
    const { categoryId: newCategoryId } = req.body;

    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    const oldCategoryId = product.categoryId;

    if (oldCategoryId && oldCategoryId.toString() !== newCategoryId) {
      const oldCategory = await Category.findById(oldCategoryId);
      if (oldCategory) {
        oldCategory.products = oldCategory.products.filter(
          (productId) => productId.toString() !== id
        );

        await oldCategory.save();
      } else {
        return res.status(400).json({
          success: false,
          message: `Không tìm thấy danh mục cũ: ${oldCategoryId}`,
        });
      }
    }

    const productName = req.body.name;
    let newSlug = product.slug;
    if (productName) {
      const existingProduct = await Product.findOne({
        // Tìm kiếm sản phẩm trùng tên ngoại trừ sản phẩm hiện tại bằng toán từ $ne
        _id: { $ne: id },
        name: { $regex: productName, $options: "i" },
      });

      newSlug = slugify(req.body.name, { lower: true });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          messages:
            "Sản phẩm trùng tên đã tồn tại, vui lòng nhập lại tên sản phẩm",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, slug: newSlug },
      {
        new: true,
      }
    );

    const thumbFiles = req?.files?.["thumb"];
    const imageFiles = req?.files?.["images"];

    if (thumbFiles && thumbFiles.length > 0) {
      updatedProduct.thumb = thumbFiles[0].path;
    }

    if (imageFiles && imageFiles.length > 0) {
      updatedProduct.images = imageFiles.map((file) => file.path);
    }

    await updatedProduct.save();

    return res.status(200).json({
      success: updatedProduct ? true : false,
      updatedProduct: updatedProduct
        ? updatedProduct
        : "Cập nhật sản phẩm thất bại",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findById(id);

    if (!deleteProduct) throw new Error("Không tìm thấy sản phẩm");

    await Category.findByIdAndUpdate(deleteProduct.categoryId, {
      $pull: { products: id },
    });

    const deletedProduct = await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: deletedProduct ? true : false,
      deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("categoryId", "name");

    if (product) {
      return res.status(200).json({
        success: true,
        productData: product,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const productSlug = req.params.slug;
    const product = await Product.findOne({ slug: productSlug }).populate({
      path: "categoryId",
      select: "name slug",
    });

    if (product) {
      return res.status(200).json({
        success: true,
        productData: product,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const queries = { ...req.query };
    const exculdeFields = ["limit", "sort", "page", "fields"];
    exculdeFields.forEach((item) => delete queries[item]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matchedItem) => `$${matchedItem}`
    );

    const formatedQueries = JSON.parse(queryString);

    if (queries?.name)
      formatedQueries.name = { $regex: queries.name, $options: "i" };

    let queryCommand = Product.find(formatedQueries).populate({
      path: "categoryId",
      select: "name slug",
    });

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select("-__v");
    }

    const page = +req.query.page * 1 || 1;
    const limit = +req.query.limit * 1 || 1000000;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    queryCommand.exec(async (err, response) => {
      if (err) throw new Error(err.message);
      const counts = await Product.find(formatedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : "Cannot get products",
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error?.message,
    });
  }
};

const getProductsClient = async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((item) => delete queries[item]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matchedItem) => `$${matchedItem}`
    );

    const formattedQueries = JSON.parse(queryString);

    if (queries?.name)
      formattedQueries.name = { $regex: queries.name, $options: "i" };

    // Thêm mã để lấy các sản phẩm cùng danh mục
    if (queries?.categoryId && Types.ObjectId.isValid(queries.categoryId))
      formattedQueries.categoryId = queries.categoryId;
    let queryCommand = Product.find(formattedQueries).populate({
      path: "categoryId",
      select: "name slug",
    });

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select("-__v");
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    const response = await queryCommand.exec();
    const totalProduct = await Product.countDocuments(formattedQueries);
    const totalPages = Math.ceil(totalProduct / +limit);

    return res.status(200).json({
      success: response.length > 0,
      totalPages,
      totalProduct,
      products: response.length > 0 ? response : "Cannot get products",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error?.message,
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.find({ categoryId: id });
    if (!products)
      return res.status(404).json({
        message: "Không tìm thấy sản phấm chứa danh mục này!",
        success: false,
      });
    return res.status(200).json({
      message: "Oke nè!",
      success: true,
      products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error?.message,
    });
  }
};

const uploadImagesProducts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files) throw new Error("Missing inputs");

    const response = await Product.findByIdAndUpdate(
      id,
      {
        $push: { images: { $each: req.files.map((el) => el.path) } },
      },
      { new: true }
    );

    return res.status(200).json({
      status: response ? true : false,
      updatedProduct: response ? response : "Cannot upload images product",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error?.message,
    });
  }
};

export {
  createProduct,
  updateProduct,
  getProduct,
  getProducts,
  getProductsClient,
  getProductByCategory,
  deleteProduct,
  getProductBySlug,
};
