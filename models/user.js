import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/user-profile-icon-trendy-flat-260nw-1923506948.jpg",
    },
    role: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("User", userSchema);
