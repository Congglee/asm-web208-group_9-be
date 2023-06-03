const mongoose = require("mongoose"); // Erase if already required

var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: "name",
    },
    image: {
      type: String,
    },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

//Export the model
export default ("Category", categorySchema);