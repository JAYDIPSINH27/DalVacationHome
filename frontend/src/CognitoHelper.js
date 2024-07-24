import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID, // e.g., 'us-east-1_ABC123'
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID, // e.g., '1h2j3k4l5m6n7o8p9q'
  };

const store = {};

export const getUserPool = () => {
  return new CognitoUserPool(poolData);
}
export const getCognitoUser = (username) => {
    const userPool = getUserPool();
    return new CognitoUser({
        Username: username,
        Pool: userPool,
    });
}

export const getUserAttributes = (username) => {
    
}

export const getAwsCredentials = (username, password) => {
    const authenticationData = {
        Username: username,
        Password: password, // This is required for SRP_A calculation
      };

      return new AuthenticationDetails(authenticationData);
}

export const logout = () => {
    const userPool = getUserPool();
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
}