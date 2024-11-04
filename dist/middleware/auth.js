"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const checkAuth = (req, res, next) => {
    const { authToken } = req.signedCookies;
    console.log(authToken);
    if (authToken === "authenticated") {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.checkAuth = checkAuth;
