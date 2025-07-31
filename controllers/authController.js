const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const generateTOken = require('../utils/generateToken');
const debug = require('debug')('development:authController');


module.exports.registerUser = async (req, res) => {
    let { name, email, password } = req.body;

    try {
        if (!name || !email || !password) return res.status(401).json({ message: "All fields are required" });

        const user = await userModel.findOne({ email });

        if (user) return res.status(409).json({ message: "User with this Email already Exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({ message: "Registered Successfully" });
    }
    catch (err) {
        debug("Failed to create user", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}


module.exports.loginUser = async (req, res) => {

    try {

        let { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid Credentials" });

        const result = await bcrypt.compare(password, user.password);

        if (!result) return res.status(404).json({ message: "Invalid Credentials" });

        const token = generateTOken(user);
        return res.status(200).json({
            message: "Logged in Successfully",
            access: token
        })


    } catch (err) {
        debug("Failed to Login", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}