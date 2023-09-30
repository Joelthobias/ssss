import bcrypt from 'bcrypt';
import OTP from '../models/otpModel.js';
import db from '../connection.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password, role, otp } = req.body;
        // Check if all details are provided
        if (!name || !email || !password || !otp) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // Check if user already exists
        let existingUser = await db.get().collection('user').find({ email }).toArray();
        if (existingUser.email) {
            console.log(existingUser);
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        // Find the most recent OTP for the email
        const response = await db.get().collection('otp').find({ email }).toArray();
        console.log(response);
        if (response[0].email) {
            if (response.length === 0 || otp !== response[0].otp) {
                return res.status(400).json({
                    success: false,
                    message: 'The OTP is not valid',
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid Email',
            });
        }
        // Secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Hashing password error for ${password}: ` + error.message,
            });
        }
        let userJson = {
            name,
            email,
            password: hashedPassword,
            role,
        };
        const newUser = await db.get().collection('user').insertOne(userJson);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};
