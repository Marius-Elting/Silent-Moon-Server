import { createHmac } from "crypto"

export const encrypt = (req, _, next) => {
    console.log(req)
    const hmac = createHmac("sha256", req.body.password)
    req.body.password = hmac.digest("hex")
    next()
}