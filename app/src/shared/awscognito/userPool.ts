import { CognitoUserPool } from 'amazon-cognito-identity-js';

const UserPool = new CognitoUserPool({
  UserPoolId: 'eu-central-1_bzl57SX04',
  ClientId: 'sdpfrpukifetupagvhgh6vh5d',
});

export default UserPool;
