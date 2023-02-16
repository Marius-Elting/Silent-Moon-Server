import { createHmac } from "crypto";
import jwt from "jsonwebtoken";

export const encrypt = (req, _, next) => {
    console.log(req);
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
        res.end();
    }
};
export const auth = (req, res, next) => {
    const token = req.cookies.token;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        console.log(req.user);
        console.log("user authenticated");
        next();
    } catch (err) {
        console.log(err);
        console.log("user unauthenticated");
        res.end();
    }
};

