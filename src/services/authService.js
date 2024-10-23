import jwt from "../lib/jwt.js";

import User from "../models/User.js";
import bcrypt from "bcrypt";

const authService = {
    async register(username, email, password, rePassword) {
        const user = await User.findOne({ $or: [{ email }, { username }] });
        
        if (password !== rePassword) {
            throw new Error("The password does not match!");
        }
        
        if (user) {
            throw new Error("The user already exists!");
        }

        const newUser = await User.create({
            username,
            email,
            password
        });

        return this.generateToken(newUser);
    },
    async login(email, password) {
        const user = await User.findOne({ email });

        if(!user) {
            throw new Error("Invalid email or password!");
        };

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            throw new Error("Invalid email or password!");
        };

        return this.generateToken(user);
    },
    async generateToken(user) {
        const payload = {
            _id: user._id,
            email: user.email,
            username: user.username,
        }

        const header = {expiresIn: "2h"};

        const token = jwt.sign(payload, process.env.JWT_SECRET, header); 

        return token;
    },
};

export default authService;