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
        await userSchema.validateAsync(user, { abortEarly: false });
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
                const dbResult = await db.collection("user").insertOne(user);
                user.id = dbResult._id
                const token = createToken(user);
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
    if (!email || !password) {
        res.status(400).json({ message: "Please insert information" });
        return;
    } try {
        const db = await getDb();
        const user = await db.collection("user").findOne({ email });
        if (!user) {
            res.status(401).json({ message: "user does not exists" });
        }
        if (password !== user.password) {
            res.status(401).json({ message: "email or password is not correct" });
        } else {
            delete user.password;
            const token = createToken(user);
            sendCookie(res, token);
            res.status(200).json({ message: "loggedin", user, token });
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Login Error" });
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
    res.clearCookie("token", { path: '/' });
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
        console.log(result)
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


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2Y1MWMxMDYxMWVkZjYzMjllYTdjOWEiLCJpYXQiOjE2ODMxMzg0ODEsImV4cCI6MTY4MzE0MDI4MX0.RKXjbM-veHhMrZk30Q9UkpF5MD7w9A6NxNgNDxC1vYQ
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2Y1MWMxMDYxMWVkZjYzMjllYTdjOWEiLCJpYXQiOjE2ODMxMzg1NTQsImV4cCI6MTY4MzE0MDM1NH0.m1V77mRPyLgDnocM4i_wCyVCpdMjyt7slp-j674vhRM
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2Y1MWMxMDYxMWVkZjYzMjllYTdjOWEiLCJpYXQiOjE2ODMxMzg1NjksImV4cCI6MTY4MzE0MDM2OX0.RTW5iXncHm2okfqNrIN3Di1ZK7hin73XIR3ThHl4SYY
