



export const sendCookie = (res, token) => {
    console.log(token);
    const a = res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    console.log(a);
};