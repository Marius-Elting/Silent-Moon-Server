import { fileUpload } from "../services/uploadDao.js"
import fs from "fs"
import { writeDB } from "../services/writeDBDao.js";
import cloudinary from "cloudinary"

export const uploadImage = async (req, res) => {
    try {
        console.log("first")
        const uploader = async (path) => await fileUpload(path, "Images");
        const urls = []
        const files = req.files

        for (const file of files) {
            const { path } = file
            const newPath = await uploader(path)
            urls.push(newPath)
            fs.unlink(path, (err) => {
                console.log(err)
            })
        }
        let dbData
        try {

            dbData = await writeDB(req, urls)
        } catch (err) {
            res.status(500).json({
                message: "please define all values",
            })
            urls.forEach(url => {
                console.log(url.id)
                cloudinary.uploader.destroy(url.id, (err) => {
                    console.log(err)
                })
            })
            return
        }

        res.status(200).json({
            message: "uploaded",
            data: dbData
        })
    } catch (err) {
        console.log(err)
    }
}