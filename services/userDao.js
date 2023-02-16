import { ObjectId } from "mongodb";
import { getDb } from "../util/db.js";

export const getUser = async (req, res) => {
    const db = await getDb();
    const pointer = await db.collection("user").findOne({ _id: ObjectId(req.body.id) });
    // const user = await pointer.toArray();
    return pointer;
};