import userSchema from './user.js';
import connectToDatabase from '../db.js';
import { ObjectId } from 'mongodb';

const createUserModel = async () => {
    try {
        const db = await connectToDatabase();
        const userModel = db.collection('users');
        console.log('created userModel');
        return userModel;
    } catch (error) {
        console.error('Error creating user model:', error);
        throw error;
    }
}
export default createUserModel;