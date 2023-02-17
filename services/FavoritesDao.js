import { getDb } from "../util/db.js";
import { ObjectId } from "mongodb";


export const RemoveFavorite = async (dbUser, item) => {
    const db = await getDb();
    const i = dbUser.favorites.indexOf(item);
    dbUser.favorites.splice(i, 1);
    try {
        // await db.collection("user").updateOne(
        //     { _id: ObjectId(dbUser._id) },
        //     { $set: { ...dbUser } }
        // )
        await db.collection("user").updateOne(
            { _id: ObjectId(dbUser._id) },
            { $pull: { favorites: item } }
        );
        return "removed Favorite";
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }


};

export const addFavorite = async (dbUser, item) => {
    const db = await getDb();
    try {
        dbUser.favorites.push(item);
        await db.collection("user").updateOne(
            { _id: ObjectId(dbUser._id) },
            { $set: { ...dbUser } }
        );
    } catch (err) {
        console.log(err);
        throw new Error;
    }
};