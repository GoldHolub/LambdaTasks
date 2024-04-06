import userRepository from "../repositories/UserRepository.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const registrationService = {
    async registerUser(email, password) {
        try {
            const existingUser = await userRepository.getUserByEmail(email);
            if (existingUser) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const user = {
                email: email,
                password: hashedPassword
            };

            const userId = await userRepository.createUser(user);

            return userId;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }
};

export default registrationService;