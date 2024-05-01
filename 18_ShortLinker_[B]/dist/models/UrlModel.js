import mongoose, { Schema } from 'mongoose';
const urlSchema = new Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
});
export default mongoose.model('Url', urlSchema);
//# sourceMappingURL=UrlModel.js.map