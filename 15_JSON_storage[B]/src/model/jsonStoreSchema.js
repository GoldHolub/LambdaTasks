import mongoose from 'mongoose';

const jsonStorageSchema = mongoose.Schema({
    path: { type: String, unique: true },
    data: { type: Object, unique: false }
});

const jsonStorageModel = mongoose.model('Json', jsonStorageSchema, 'users_json');

export default jsonStorageModel;