import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const fileUpload = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            });
        }, {
            resource_type: "auto",
            folder: folder
        }
        );
    });
};


export const getUploadPath = async (req, res) => {
    const uploader = async (path) => await fileUpload(path, "Images");
    const file = req.files[0];
    const { path } = file;
    const newPath = await uploader(path);

    fs.unlink(path, (err) => {
        console.log(err);
    });
    return newPath;
};