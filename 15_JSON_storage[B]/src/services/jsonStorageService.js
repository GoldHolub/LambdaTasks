import jsonStorageModel from "../model/jsonStoreSchema.js";

const JsonStorageService = {
    async storeJson(path, data) {
        try {
            const existingJsonData = await jsonStorageModel.findOne({ path });
            if (existingJsonData) {
                throw new Error(`path: ${path} already taken. Please select another one.`);
            }
            const jsonData = new jsonStorageModel({ path, data });
            await jsonData.save();
        } catch (error) {
            throw error;
        }
    },
    async getJson(path) {
        try {
            const jsonData = await jsonStorageModel.findOne({ path });
            if (!jsonData) {
                throw new Error(`Can't find json by path: ${path}.`);
            }
            return jsonData.data;
        } catch (error) {
            throw error;
        }
    }
}

export default JsonStorageService;