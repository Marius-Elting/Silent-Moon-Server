import { getDb } from "../util/db.js";
import { ObjectId } from "mongodb";
import { addFavorite, RemoveFavorite } from "../services/FavoritesDao.js";
import { getUser } from "../services/userDao.js";



export const addNewFavorite = async (req, res) => {
    let userData;
    let item;
    try {
        userData = req.body.user.userData;
        item = req.body.item;
    } catch (err) {
        res.end();
        return;
    }
    const id = userData._id;
    const db = await getDb();
    const dbUser = await db.collection("user").findOne({ _id: ObjectId(id) });
    if (!dbUser) {
        res.status(500).json({ message: "ERROR" });
        return;
    }

    if (dbUser.favorites.filter(fav => fav.id === item.id).length > 0) {
        try {
            await RemoveFavorite(dbUser, item);
            res.status(200).json({ favorites: dbUser.favorites, message: `Removed FavoriteID ${item}` });

        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Thats an Error" });
        }
        return;
    } else {
        try {
            await addFavorite(dbUser, item);
            res.status(200).json({ favorites: dbUser.favorites });
        } catch (err) {
            res.status(400).json({ message: "This is an Error" });
            console.log(err);
        }
    }
};



export const getAllFavorites = async (req, res) => {
    const user = await getUser(req, res);
    const type = req.body.type;
    const favoriteIDs = type === "all" ? user.favorites : user.favorites.filter(fav => fav.type === type);
    const db = await getDb();
    const favPointer = await db.collection('exercise').find({ "_id": { "$in": favoriteIDs.map(fay => ObjectId(fay.id)) } });
    const favorites = await favPointer.toArray();

    res.status(200).json({ user, favorites });
};