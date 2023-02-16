import fs from "fs";
import { addCategory, sendExercise, getAllExercise, getExercisebyId } from "../services/exerciseDao.js";
import cloudinary from "cloudinary";
import { getDb } from "../util/db.js";
import { ObjectId } from "mongodb";
import { getUploadPath } from "../services/uploadDao.js";

export const addExercise = async (req, res) => {
    try {
        const path = await getUploadPath(req, res);
        try {
            const dbData = await sendExercise(req, path);
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
    }
};


export const getExercise = async (req, res) => {
    try {
        const data = await getAllExercise();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Database Error" });
    }
};

export const getSingleExercise = async (req, res) => {
    try {
        const data = await getExercisebyId(req);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};






