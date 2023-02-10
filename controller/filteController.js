import Datauri from 'datauri';
import path from 'path';
import multer from 'multer'
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
// const dUri = new Datauri();

// const dataUri = (req) => {
//     dUri.format(path.extname(req.file.originalname).toString(),
//         req.file.buffer
//     )
// }

export { multerUploads }