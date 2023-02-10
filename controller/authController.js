import { getDb } from "../util/db.js"
import jwt from "jsonwebtoken"
import { createToken } from "../util/token.js"
export const registerUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    const db = await getDb()
    const user = {
        firstname,
        lastname,
        email,
        password
    }
    if (!firstname || !lastname || !email || !password) {
        res.status(400).json({ message: "Please insert information" })
        return
    }
    const userExists = await db.collection("user").findOne({ email })
    if (userExists) {
        res.status(400).json({ message: "Email already in use" })
    } else {
        const token = createToken(user)
        await db.collection("user").insertOne(user)
        delete user.password
        res.status(200).json({ message: "user created", user, token })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    const db = await getDb()
    console.log(email, password)
    if (!email || !password) {
        res.status(400).json({ message: "Please insert information" })
    }
    const user = await db.collection("user").findOne({ email })
    if (!user) {
        res.status(400).json({ message: "user does not exists" })
    }
    console.log(user)
    console.log(password)
    console.log(user.password)
    if (password !== user.password) {
        res.status(400).json({ message: "email or password is not correct" })
    } else {
        delete user.password
        const token = createToken(email)
        res.status(200).json({ message: "loggedin", user, token })
    }

}
