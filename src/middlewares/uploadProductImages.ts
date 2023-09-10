import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/productImages/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadProductFile = multer({
    storage : storage
}).array('productImages' , 5);

export default uploadProductFile;