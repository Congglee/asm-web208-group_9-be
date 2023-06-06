import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: { type: String, slug: "name" },
    thumb: {
      type: String,
      required: true,
    },
    images: [],
    price: {
      type: Number,
      required: true,
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

mongoose.plugin(slug);

//Export the model
export default mongoose.model("Product", productSchema);
