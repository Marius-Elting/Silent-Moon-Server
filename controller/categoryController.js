import fs from "fs";
import { addCategory } from "../services/exerciseDao.js";
import cloudinary from "cloudinary";
import { getDb } from "../util/db.js";
import { ObjectId } from "mongodb";
import { getUploadPath } from "../services/uploadDao.js";


export const addSingleCategory = async (req, res) => {
    try {
        const path = await getUploadPath(req, res);
        try {
            const dbData = await addCategory(req, path);
            res.status(200).json({
                message: "uploaded",
                data: dbData
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "please define all values" });
            cloudinary.uploader.destroy(path.id, (err) => console.log(err));
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error" });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const db = await getDb();
        const data = await db.collection("category").find().toArray();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};

export const getSingleCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const db = await getDb();
        const data = await db.collection("exercise").find({ category: category }).toArray();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};


export const getCategoryByType = async (req, res) => {
    const { type } = req.body;
    try {
        const db = await getDb();
        const data = await db.collection("category").find({ type: type }).toArray();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
}

