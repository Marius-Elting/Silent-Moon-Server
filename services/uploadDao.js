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

    console.log(req.files.findIndex(x => x.mimetype.includes("video")));
    if (req.files.findIndex(x => x.mimetype.includes("video")) === -1) {
        const imageIndex = req.files.findIndex(x => x.mimetype.includes("image"));
        const newImagePath = req.files[imageIndex].path;
        const imagePath = await uploader(newImagePath);
        fs.unlink(newImagePath, (err) => {
            console.log(err);
        });
        return imagePath;
    } else {

        const imageIndex = req.files.findIndex(x => x.mimetype.includes("image"));
        const videoIndex = req.files.findIndex(x => x.mimetype.includes("video"));
        const newVideoPath = req.files[videoIndex].path;
        const newImagePath = req.files[imageIndex].path;
        const videoPath = await uploader(newVideoPath);
        const imagePath = await uploader(newImagePath);
        fs.unlink(newVideoPath, (err) => {
            console.log(err);
        });
        fs.unlink(newImagePath, (err) => {
            console.log(err);
        });

        return { videoPath, imagePath };

    }





};