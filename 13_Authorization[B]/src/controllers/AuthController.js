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
            const { refreshToken } = req.headers.authorization.split(' ')[1];
            const accessToken = await authService.refreshToken(refreshToken);
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getMe(req, res) {
        try {
            const refreshToken = req.headers.authorization.split(' ')[1];
            const userData = await authService.getMe(refreshToken);
            res.status(200).json(userData);
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
};

export default AuthController;
