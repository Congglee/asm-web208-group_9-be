import Product from "../models/product";

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

export { uploadImagesProducts };
