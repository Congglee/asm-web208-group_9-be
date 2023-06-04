import Product from "../models/product";
import Category from "../models/category";
import slugify from "slugify";

const create = async (req, res) => {
  try {
    const { name, description, thumb, images, price, categoryId } = req.body;

    if (!name || !description || !thumb || !images || !price || !categoryId) {
      return res.status(401).json({ message: "Khong duoc bo trong!" });
    }
    const checkName = await Product.findOne({ name });

    const product = await Product(req.body).save();
    return res.status(200).json({
      message: "Them san pham thanh cong!",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, description, thumb, images, price, categoryId } = req.body;
    if (!name || !description || !thumb || !images || !price) {
      return res.status(401).json({ message: "Không được bỏ trống!" });
    }
    const newSlug = slugify(name, { lower: true });
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, // ID của sản phẩm cần cập nhật
      {
        name,
        description,
        thumb,
        images,
        price,
        categoryId,
        slug: newSlug, // Cập nhật trường slug với giá trị mới
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cập nhật sản phẩm thất bại: " + error.message,
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
      mes: error?.message,
    });
  }
};
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin sản phẩm theo ID
    const product = await Product.findById(id).populate("categoryId", "name");

    if (product) {
      return res.status(200).json({
        message: "Lấy sản phẩm thành công!",
        product,
        categoryName: product.categoryId.name,
      });
    } else {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Lấy sản phẩm thất bại!",
      error: error.message,
    });
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products)
      return res
        .status(401)
        .json({ message: "Danh sach trong!", status: false });
    console.log("asdads" + products);
    return res.status(200).json({
      products,
      message: "Tất cả sản phẩm!",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get All Product Error:" + error.message,
      status: false,
    });
  }
};
const uploadImagesProducts = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!req.files) throw new Error("Missing inputs");

    const response = await Product.findByIdAndUpdate(
      pid,
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
  create,
  update,
  getProduct,
  getProducts,
  deleteProduct,
  uploadImagesProducts,
};
