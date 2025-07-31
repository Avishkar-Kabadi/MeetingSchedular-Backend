const jwt = require("jsonwebtoken");
const debug = require('debug')('development:idLoggedIn');


const isLoggedIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.user = decoded;

        next();
    } catch (err) {
        debug("Failed to Authenticate user", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = isLoggedIn;
