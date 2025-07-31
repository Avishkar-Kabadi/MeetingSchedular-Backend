
const jwt = require('jsonwebtoken');

const generateTOken = (user) => {
    return jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_KEY);
};


module.exports = generateTOken;