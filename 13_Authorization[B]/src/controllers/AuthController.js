import { response } from "express";
import authService from "../services/AuthService.js";

const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const accessToken = await authService.authenticateUser(email, password);
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async refresh(req, res) {
        try {
            const refreshToken = req.headers.authorization.split(' ')[1];
            const accessToken = await authService.refreshAccessToken(refreshToken);
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getMe(req, res) {
        try {
            const requestNum = parseInt(req.params.requestNum);
            if (requestNum > 9 || requestNum < 0) throw new Error('request_num should be from 0 to 9');
            const refreshToken = req.headers.authorization.split(' ')[1];
            
            const userData = await authService.getMe(refreshToken);
            const response = {
                request_num: requestNum,
                data: {
                    username: userData.email
                }
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(401).json({ error: `(401)Unauthorized: ${error.message}` });
        }
    }
};

export default AuthController;
