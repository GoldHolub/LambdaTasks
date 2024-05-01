import UrlModel from "../models/UrlModel.js";
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
dotenv.config();
const PORT = process.env.PORT ?? '3000';
export class UrlController {
    static async createShortUrl(req, res) {
        try {
            const { originalUrl } = req.body;
            let shortUrl = `localhost:${PORT}/` + nanoid(6);
            let existingUrl = await UrlModel.findOne({ shortUrl });
            while (existingUrl) {
                shortUrl = `localhost:${PORT}/` + nanoid(6);
                existingUrl = await UrlModel.findOne({ shortUrl });
            }
            const url = new UrlModel({ originalUrl, shortUrl });
            await url.save();
            res.status(200).json({ shortUrl });
        }
        catch (error) {
            console.error('Error creating short URL:', error);
            res.status(500).json({ error: 'Internal server error: can\'t create shortedLink' });
        }
    }
    static async redirectToOriginalUrl(req, res) {
        try {
            const shortUrl = req.headers.host + req.url;
            const url = await UrlModel.findOne({ shortUrl });
            if (!url) {
                return res.status(404).json({ error: 'Short URL not found' });
            }
            res.redirect(url.originalUrl);
        }
        catch (error) {
            console.error('Error redirecting:', error);
            res.status(500).json({ error: 'Internal server error: can\'t find shortedLink' });
        }
    }
}
//# sourceMappingURL=UrlController.js.map