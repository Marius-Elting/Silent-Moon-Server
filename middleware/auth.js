import { createHmac } from "crypto";
import jwt from "jsonwebtoken";
import { sendCookie } from "../services/authDao.js";
import { createToken } from "../util/token.js";
import { exerciseSchema } from "./validator.js";

export const encrypt = (req, _, next) => {

    const hmac = createHmac("sha256", req.body.password);
    req.body.password = hmac.digest("hex");
    next();
};


export const authHeader = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new Error("Authentication invalid");
    }
    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        console.log("user authenticated");
        next();
    } catch (err) {
        console.log(err);
        console.log("user unauthenticated");
        res.status(500).json({ message: "User Unauthenticated" });
        res.end();
    }
};


export const auth = (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (process.env.APP_MODE === "DEV") {
            console.log("DEV MODE");
            const token = createToken({ _id: "DEVMODE" });
            sendCookie(res, token);
            next();
        } else {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { userId: payload.userId };
            console.log("user authenticated");
            next();
        }

    } catch (err) {
        console.log(err);
        console.log("user unauthenticated");
        res.status(500).json({ message: "User Unauthenticated", type: "Error" });
        res.end();
    }
};

