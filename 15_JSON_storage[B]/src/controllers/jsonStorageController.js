import JsonStorageService from "../services/jsonStorageService.js";

const JsonStorageController = {
    async storeJson(req, res) {
        try {
            const { path } = req.params;
            const data = req.body;
            await JsonStorageService.storeJson(path, data);
            res.sendStatus(200);
        } catch (error) {
            console.error('Error storing JSON data:', error);
            res.status(500).send(`Internal server error: ${error}`);
        }
    },
    async getJson(req, res) {
        try {
            const { path } = req.params;
            const jsonData = await JsonStorageService.getJson(path);
            res.json(jsonData);
        } catch (error) {
            console.error('Error retrieving JSON data:', error);
            res.status(500).send(`Internal server error: ${error}`);
        }
    }
}

export default JsonStorageController;