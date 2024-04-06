import registrationService from "../services/RegistrationService.js";

const RegistrationController = {
    async signUp(req, res) {
        try {
            const { email, password } = req.body;
            const accessToken = await registrationService.registerUser(email, password);
            res.status(200).json({ accessToken });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
}

export default RegistrationController;
