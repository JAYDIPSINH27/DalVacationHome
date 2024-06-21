import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

const poolData = {
    UserPoolId: 'us-east-1_L7Hw0SRwb', // e.g., 'us-east-1_ABC123'
    ClientId: '5iiuu5u8sf0b3cm2rdc4t414hv', // e.g., '1h2j3k4l5m6n7o8p9q'
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

export  const getCognitoidentityserviceprovider = () => {
  return new AWS.CognitoIdentityServiceProvider();
}

export const logout = () => {
    const userPool = getUserPool();
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
}