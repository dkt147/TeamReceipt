import multer from "multer";
import path from "path";
import fs from "fs";

const __basedir = path.resolve();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __basedir + "/src/Uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("unsupported file"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

const deleteImages = (images) => {
  for (const image of images) {
    const imagePath = path.join(__basedir, "src", image.path);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

export { upload, deleteImages };
