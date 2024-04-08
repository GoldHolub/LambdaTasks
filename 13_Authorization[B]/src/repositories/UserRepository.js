import connectToDatabase from "../db.js";
import {ObjectId} from 'mongodb';

const userRepository = {
    async createUser(user) {
        try {
            if (!user.email || !user.password) {
                throw new Error('Email and password are required');
            }

            const existingUser = await userRepository.getUserByEmail(user.email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            const db = await connectToDatabase();
            const result = await db.collection('users').insertOne(user);
            const { insertedId } = result;
            return { userId: insertedId, email: user.email };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    async getUserById(userId) {
        try {
            const db = await connectToDatabase();
            const objectId = new ObjectId(userId);
            return db.collection('users').findOne({ _id: objectId });
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    },

    async getUserByEmail(email) {
        try {
            const db = await connectToDatabase();
            return db.collection('users').findOne({ email });
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    },
};

export default userRepository;