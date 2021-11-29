import multer, { FileFilterCallback, Multer }  from "multer";

const excelFilter = (req: any, file: any, callback: any) => {
    if (
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml")
    ) {
        callback(null, true);
    } else {
        callback("Please upload only excel file.", false);
    }
  };

  var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, global.__filename + "/uploads");
    },
    filename: (req, file, callback) => {
      console.log(file.originalname);
      callback(null, `${Date.now()}-bezkoder-${file.originalname}`);
    },
  });
  
const uploadFileMiddleware = multer({ storage: storage, fileFilter: excelFilter });
export default uploadFileMiddleware;