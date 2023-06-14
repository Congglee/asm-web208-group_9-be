import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Set Cloudinary configuration parameters using config . method
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// console.log(process.env.CLOUDINARY_KEY);

// Set middleware multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg", "webp"],
  params: {
    folder: "asm-web208",
  },
});

// uploadCloud là một cấu hình sẵn sàng sử dụng cho phép xử lý các file tải lên trong ứng dụng của mình và lưu trữ chúng trong tài khoản Cloudinary của bằng cách sử dụng middleware multer. (uploadCloud có thể được sử dụng làm middleware trong Express route để xử lý các file tải lên và lưu trữ chúng trong tài khoản Cloudinary đã định cấu hình.)
const uploadCloud = multer({ storage });

export default uploadCloud;
