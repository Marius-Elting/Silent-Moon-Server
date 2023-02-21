import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        if (file.mimetype === "image/*") {
            cb(null, new Date().toISOString() + "-IMAGE-" + file.originalname);
        } else {
            cb(null, new Date().toISOString() + "-VIDEO-" + file.originalname);
        }
    }
});

const fileFilter = (req, file, cb) => {
    // if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" | file.mimetype === "image/webp") {
    cb(null, true);
    // } else {
    //     cb({ message: "Unsupported file format" }, false);
    // }

};

export const upload = multer({
    storage: storage,
})


