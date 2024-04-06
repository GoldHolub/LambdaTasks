import connectToDatabase from "../db.js";

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
            const objectId = new objectId(userId);
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

    async updateUser(userId, updatedUserData) {
        try {
            const db = await connectToDatabase();
            return db.collection('users').updateOne({ _id: userId }, { $set: updatedUserData });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    async deleteUser(userId) {
        try {
            const db = await connectToDatabase();
            return db.collection('users').deleteOne({ _id: userId });
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
};

export default userRepository;