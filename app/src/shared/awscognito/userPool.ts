import * as Cognito from 'amazon-cognito-identity-js';

const UserPool = new Cognito.CognitoUserPool({
  UserPoolId: 'eu-central-1_bzl57SX04',
  ClientId: 'sdpfrpukifetupagvhgh6vh5d',
});

export default UserPool;
