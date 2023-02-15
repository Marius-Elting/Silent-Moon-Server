import { fileUpload } from "../services/uploadDao.js"
import fs from "fs"
import { writeDB } from "../services/writeDBDao.js";
import cloudinary from "cloudinary"
import { getDb } from "../util/db.js";
import { ObjectID } from "bson";

export const uploadImage = async (req, res) => {
    try {

        const uploader = async (path) => await fileUpload(path, "Images");
        const file = req.files[0]
        const { path } = file
        const newPath = await uploader(path)

        fs.unlink(path, (err) => {
            console.log(err)
        })
        let dbData
        try {
            dbData = await writeDB(req, newPath)
        } catch (err) {
            res.status(500).json({
                message: "please define all values",
            })
            cloudinary.uploader.destroy(newPath.id, (err) => {
                console.log(err)
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


export const getExercise = async (req, res) => {
    try {
        const db = await getDb()
        const pointer = await db.collection("exercise").find()
        const data = await pointer.toArray()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ message: "Database Error" })
    }
}

export const getSingleExercise = async (req, res) => {

    try {
        const db = await getDb()
        const pointer = await db.collection("exercise").find({ _id: ObjectID(req.params.id) })
        const data = await pointer.toArray()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ message: "Database Error" })
    }
}


export const getAllCategories = async (req, res) => {
    try {
        const db = await getDb()
        const pointer = await db.collection("exercise").find()
        const data = await pointer.toArray()
        const categories = []
        data.forEach((res) => {
            res.category.forEach((cat) => {
                if (!categories.includes(cat)) {
                    categories.push(cat)
                }
            })
        })
        res.status(200).json(categories)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Database Error" })
    }
}

export const getSingleCategory = async (req, res) => {
    const { category } = req.body
    try {
        const db = await getDb()
        const pointer = await db.collection("exercise").find({ category: category })
        const data = await pointer.toArray()
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Database Error" })
    }
}