import multer from "multer";

export type File = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
};

const storage = multer.diskStorage({
  destination: (req: any, file: File, cb: any) => {
    cb(null, "./public/uploads");
  },
  filename: (req: any, file: File, cb: any) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req: any, file: File, cb: any) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
