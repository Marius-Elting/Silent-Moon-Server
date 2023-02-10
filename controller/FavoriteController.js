import { getDb } from "../util/db.js"
import { Db, ObjectId } from "mongodb"
import { addFavorite, RemoveFavorite } from "../services/FavoritesDao.js"



export const favoriteController = async (req, res) => {
    const { user, item } = req.body
    const email = user.email
    const db = await getDb()
    const dbUser = await db.collection("user").findOne({ email })
    if (!dbUser) {
        res.status(500).json({ message: "ERROR" })
        return
    }
    if (dbUser.favorites.includes(item)) {
        try {
            await RemoveFavorite(dbUser, item)
            res.status(200).json({ message: `Removed FavoriteID ${item}` })
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: "Thats an Error" })
        }
        return
    } else {
        try {
            await addFavorite(dbUser, item)
            res.status(200).json({ dbUser })
        } catch (err) {
            res.status(400).json({ message: "This is an Error" })
            console.log(err)
        }
    }


}
