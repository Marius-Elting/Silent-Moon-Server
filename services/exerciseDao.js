import { exerciseSchema } from "../middleware/validator.js";
import { getDb } from "../util/db.js";

export const addExercise = async (req, url) => {
    const item = req.body;
    const values = await exerciseSchema.validateAsync({ ...item, image: url });
    const db = await getDb();
    console.log(values);
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