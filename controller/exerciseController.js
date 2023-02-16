import fs from "fs";
import { addCategory, addExercise } from "../services/exerciseDao.js";
import cloudinary from "cloudinary";
import { getDb } from "../util/db.js";
import { ObjectId } from "mongodb";
import { getUploadPath } from "../services/uploadDao.js";

export const uploadImage = async (req, res) => {
    try {
        const path = await getUploadPath(req, res);
        try {
            const dbData = await addExercise(req, path);
            res.status(200).json({
                message: "uploaded",
                data: dbData
            });
        } catch (err) {
            res.status(500).json({ message: "please define all values" });
            cloudinary.uploader.destroy(path.id, (err) => console.log(err));
            return;
        }
    } catch (err) {
        console.log(err);
    }
};


export const getExercise = async (req, res) => {
    try {
        const db = await getDb();
        const pointer = await db.collection("exercise").find();
        const data = await pointer.toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Database Error" });
    }
};

export const getSingleExercise = async (req, res) => {
    try {
        const db = await getDb();
        const pointer = await db.collection("exercise").find({ _id: ObjectId(req.params.id) });
        const data = await pointer.toArray();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};


export const getAllCategories = async (req, res) => {
    try {
        const db = await getDb();
        const pointer = await db.collection("exercise").find();
        const data = await pointer.toArray();
        const categories = [];
        data.forEach((res) => {
            res.category.forEach((cat) => {
                if (!categories.includes(cat)) {
                    categories.push(cat);
                }
            });
        });
        res.status(200).json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};

export const getSingleCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const db = await getDb();
        const pointer = await db.collection("exercise").find({ category: category });
        const data = await pointer.toArray();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};



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