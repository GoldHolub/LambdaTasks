import { findLocationByIp } from "../service/LocationService.mjs";

const locationController = {
    getLocation: async (req, res) => {
        const { ipAddress } = req.body;
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const location = await findLocationByIp(ipAddress);
            res.json(location);
        } catch (error) {
            let statusCode = 500;
            let errorMessage = error.message || 'An error occurred';

            if (error instanceof TypeError && error.message.includes('Invalid IP address')) {
                statusCode = 400; 
            }

            res.status(statusCode).json({ error: errorMessage });
        }
    }
};

export { locationController };