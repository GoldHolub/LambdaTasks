import userRepository from "../repositories/UserRepository.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'my_jwt_super_secret_key';

const authService = {
    async authenticateUser(email, password) {
        try {
            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new Error('Invalid password');
            }

            const accessToken = authService.generateAccessToken(user);

            return accessToken;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw error;
        }
    },

    generateAccessToken(user) {
        const payload = {
            userId: user._id,
            email: user.email
        };
        const randExpirationTime = Math.floor(Math.random() * 30 + 30);
        const expiresIn = `${randExpirationTime}s`;
        return jwt.sign(payload, JWT_SECRET, { expiresIn });
    },

    async refreshAccessToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, JWT_SECRET);
            const user = await userRepository.getUserById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const accessToken = authService.generateAccessToken(user);
            return accessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
    },

    async getMe(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, JWT_SECRET);
            const user = await userRepository.getUserById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
    }
};

export default authService;
