



export const sendCookie = (res, token) => {
    const a = res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });

};