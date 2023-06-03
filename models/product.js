import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: "name",
    },
    thumb: {
      type: String,
      require: true,
    },
    images: {
      type: Array,
      default: [],
    },
    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Product", productSchema);
