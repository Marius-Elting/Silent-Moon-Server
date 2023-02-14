import { getDb } from "../util/db.js";

export const writeDB = async (req, url) => {
    const newItem = {
        image: url,
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        duration: req.body.duration,
        level: req.body.level,
        category: req.body.category
    }

    if (!newItem.image || !newItem.name || !newItem.description || !newItem.type || !newItem.duration || !newItem.level || !newItem.category) {
        throw new Error("Please define all values")
    }
    const db = await getDb()
    db.collection("exercise").insertOne(newItem)
    return newItem
}