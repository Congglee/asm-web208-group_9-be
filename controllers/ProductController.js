import Product from "../models/product";
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
      console.log(errors);
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

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

    // const imageLinks = req.files.map((el) => el.path);
    // newProduct.images = imageLinks;

    const thumbFiles = req.files["thumb"];
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
  deleteProduct,
  uploadImagesProducts,
  getProductBySlug,
};
