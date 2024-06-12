import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider();
const clientId = process.env.CLIENT_ID!;

export const sighIn: APIGatewayProxyHandler = async (event) => {
    try {
        const { username, password, mfaCode } = JSON.parse(event.body!);

        if (!username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Username and password are required' }),
            };
        }

        const authParams = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        };

        const authResult = await cognito.initiateAuth(authParams).promise();

        if (authResult.ChallengeName === 'SMS_MFA' || authResult.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
            if (!mfaCode) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'MFA code is required' }),
                };
            }

            const respondToAuthChallengeParams = {
                ClientId: clientId,
                ChallengeName: authResult.ChallengeName,
                Session: authResult.Session,
                ChallengeResponses: {
                    USERNAME: username,
                    [authResult.ChallengeName === 'SMS_MFA' ? 'SMS_MFA_CODE' : 'SOFTWARE_TOKEN_MFA_CODE']: mfaCode, 
                },
            };

            const challengeResponse = await cognito.respondToAuthChallenge(respondToAuthChallengeParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Sign-in successful',
                    accessToken: challengeResponse.AuthenticationResult?.AccessToken,
                    idToken: challengeResponse.AuthenticationResult?.IdToken,
                    refreshToken: challengeResponse.AuthenticationResult?.RefreshToken,
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Sign-in successful',
                accessToken: authResult.AuthenticationResult?.AccessToken,
                idToken: authResult.AuthenticationResult?.IdToken,
                refreshToken: authResult.AuthenticationResult?.RefreshToken,
            }),
        };
    } catch (error) {
        console.error('Sign-in error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Sign-in failed',
                error: error,
            }),
        };
    }
}