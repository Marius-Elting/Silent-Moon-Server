import { exerciseSchema } from "../middleware/validator.js";
import { getDb } from "../util/db.js";
import { ObjectId } from "mongodb";
export const sendExercise = async (req, url) => {
    const item = req.body;
    const values = await exerciseSchema.validateAsync({ ...item, image: url });
    const db = await getDb();
    db.collection("exercise").insertOne(values);
    return values;
};

export const addCategory = async (req, url) => {
    const category = {
        name: req.body.name,
        img: url,
        type: req.body.type
    };
    const db = await getDb();
    await db.collection("category").insertOne(category);
    return category;
};

export const getAllExercise = async () => {
    const db = await getDb();
    const pointer = await db.collection("exercise").find();
    const data = await pointer.toArray();
    return data;
};

export const getExercisebyId = async (req) => {
    const db = await getDb();
    const pointer = await db.collection("exercise").find({ _id: ObjectId(req.params.id) });
    const data = await pointer.toArray();
    return data;
};