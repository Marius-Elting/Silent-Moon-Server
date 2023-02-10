import { getDb } from "../util/db.js"
import { Db, ObjectId } from "mongodb"



export const addFavorite = async (req, res) => {
    const { user, item } = req.body
    const email = user.email
    const db = await getDb()
    const dbUser = await db.collection("user").findOne({ email })
    if (!dbUser) {
        res.status(500).json({ message: "ERROR" })
        return
    }
    if (dbUser.favorites.includes(item)) {
        const i = dbUser.favorites.indexOf(item)
        dbUser.favorites.splice(i, 1)

        await db.collection("user").updateOne(
            { _id: ObjectId(dbUser._id) },
            { $set: { ...dbUser } }
        )
        res.status(200).json({ dbUser })
        return
    } else {
        dbUser.favorites.push(item)
        await db.collection("user").updateOne(
            { _id: ObjectId(dbUser._id) },
            { $set: { ...dbUser } }
        )
        res.status(200).json({ dbUser })
    }


}
