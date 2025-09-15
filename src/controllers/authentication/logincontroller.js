import jwt from 'jsonwebtoken';
import Admin from '../../models/adminmodel.js';
import { Customer } from '../../models/signupmodel.js';
import bcrypt from 'bcrypt';

export const adminlogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        let authenticatedUser = null;

        const adminUser = await Admin.findOne({ Email, Status: 'Active' }).lean();
        if (adminUser) {
            const isPasswordValid = Password === (adminUser.password || adminUser.Password);
            if (isPasswordValid) {
                authenticatedUser = adminUser;
            }
        }

        if (!authenticatedUser) {
            const customerUser = await Customer.findOne({ Email, Status: 'Active' }).lean();
            if (customerUser) {
                const isPasswordValid = await bcrypt.compare(Password, customerUser.password || customerUser.Password);
                if (isPasswordValid) {
                    authenticatedUser = customerUser;
                }
            }
        }

        if (!authenticatedUser) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: authenticatedUser._id,
                Email: authenticatedUser.Email,
                Username: authenticatedUser.UserName || authenticatedUser.Username,
                Role: authenticatedUser.Role,
                First_Name: authenticatedUser.First_Name || authenticatedUser.Full_name
            },
            process.env.TOKENSECRET
        );

        res.status(200).send({ message: 'Login successful', token, role: authenticatedUser.Role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'An error occurred during login' });
    }
};