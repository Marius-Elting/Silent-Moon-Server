import jwt from "jsonwebtoken";

export const createToken = (user) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30min" });
    return token;
};


export const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};