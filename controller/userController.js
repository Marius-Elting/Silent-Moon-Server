import { getDb } from "../util/db.js";
import jwt from "jsonwebtoken";
import { createToken, verifyToken } from "../util/token.js";
import { ObjectId } from "mongodb";
import { userSchema } from "../middleware/validator.js";
import { sendCookie } from "../services/authDao.js";

export const registerUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const db = await getDb();
    const user = {
        firstname,
        lastname,
        email,
        password,
        favorites: [],
        remindtime: []
    };
    try {
        const userAA = await userSchema.validateAsync(user, { abortEarly: false });
    } catch (err) {
        const errMessage = err.details.map(de => de.message.replace('\"', "").replace('"', ""));
        res.status(500).json({ type: "Error", message: errMessage });
        return;
    }

    const userExists = await db.collection("user").findOne({ email });
    try {
        if (userExists) {
            res.status(400).json({ message: "Email already in use" });
        } else {
            try {
                const token = createToken(user);
                await db.collection("user").insertOne(user);
                delete user.password;
                sendCookie(res, token);
                res.status(200).json({ message: "user created", user, token });
            } catch (err) {
                console.log(err);
                res.status(500), json({ message: "error" });
            }

        }
    } catch (err) {
        console.log(err);
        res.status(500), json({ message: "error" });
    }

};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const db = await getDb();
    if (!email || !password) {
        res.status(400).json({ message: "Please insert information" });
        return;
    }
    const user = await db.collection("user").findOne({ email });
    if (!user) {
        res.status(400).json({ message: "user does not exists" });
    }
    if (password !== user.password) {
        res.status(400).json({ message: "email or password is not correct" });
    } else {
        delete user.password;
        const token = createToken(user);
        sendCookie(res, token);
        res.status(200).json({ message: "loggedin", user, token });
    }
};


export const editUser = async (req, res) => {
    const id = req.body.id;
    const user = req.body.user;

    const db = await getDb();
    await db.collection("user").updateOne(
        { _id: ObjectId(id) },
        { $set: { ...user } }
    );

    res.json(user);
};


export const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Successfully logged out" });

};


export const setRemindTime = async (req, res) => {
    const remindTime = req.body.remindTime;
    console.log(remindTime);
    console.log(req.body.id);
    try {

        const db = await getDb();
        const a = await db.collection("user").updateOne({ _id: ObjectId(req.body.id) }, {
            $set: { remindTime }
        });
        console.log(a);
        res.json({ remindTime });
    } catch (err) {
        console.log(err);
        res.status(500).json({ type: "Error", message: "This is an test Error" });
    }
};



export const isUserAuth = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({ type: "Error", message: "Unauthorized" })
        return
    }
    try {
        const result = verifyToken(token)
        const db = await getDb()
        const user = await db.collection("user").findOne({ _id: new ObjectId(result.userId) })
        const newToken = createToken(user)
        sendCookie(res, newToken);
        res.json({ user, token: newToken })
    } catch (err) {
        console.log(err)
        res.status(401).json({ type: "Error", message: "Unauthorized" })
        return
    }



}