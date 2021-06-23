import React, { createContext } from 'react';
import axios from 'axios';
import { CognitoUserSession, ISignUpResult, CodeDeliveryDetails, CognitoUser } from 'amazon-cognito-identity-js';
import Amplify, { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { ENDPOINTS, getAttributesFromSession } from '#utils';

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
    oauth: {
      domain: process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN,
      scope: ['email', 'profile', 'openid'],
      redirectSignIn:
        process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_LOCAL_URL
          : process.env.NEXT_PUBLIC_PRODUCTION_URL,
      redirectSignOut:
        process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_LOCAL_URL
          : process.env.NEXT_PUBLIC_PRODUCTION_URL,
      responseType: 'token',
    },
  },
});
interface SignUp {
  (email: string, password: string, firstName: string, lastName: string, picture: string): Promise<ISignUpResult>;
}

const signUp: SignUp = async (email, password, firstName, lastName, picture) =>
  Auth.signUp({
    username: email,
    password,
    attributes: { given_name: firstName, family_name: lastName, picture },
  });

type UpdateUserAttributesType = { [key: string]: string };
interface UpdateUserAttributes {
  (attributes: UpdateUserAttributesType): Promise<string>;
}

const updateUserAttributes: UpdateUserAttributes = async (attributes) => {
  const user = (await Auth.currentUserPoolUser()) as CognitoUser;
  return Auth.updateUserAttributes(user, attributes);
};

const adminUpdateUserAttributes: UpdateUserAttributes = async (attributes) => {
  const userSession = await Auth.currentSession();
  const idToken = userSession.getIdToken().getJwtToken();
  const { id } = getAttributesFromSession(userSession);
  const response = await axios.put(`${ENDPOINTS.USERS}/${id}`, attributes, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
  });
  if (response.status === 200) return 'Successful user attributes update to third party user.';
  return 'Failure user attributes update to third party user.';
};

interface VerifyEmailAttribute {
  (
    code: string, // verification code
  ): Promise<string>;
}

const verifyEmailAttribute: VerifyEmailAttribute = (code) => Auth.verifyCurrentUserAttributeSubmit('email', code);

interface SignIn {
  (email: string, password: string): Promise<CognitoUserSession>;
}

const signIn: SignIn = async (email, password) => Auth.signIn({ username: email, password });

const signInWithGoogle = () => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });

interface SignOut {
  (): any;
}

const signOut: SignOut = () => Auth.signOut();

interface ChangePassword {
  (oldPassword: string, newPassword: string): Promise<void>;
}

const changePassword: ChangePassword = async (oldPassword, newPassword) => {
  const user = (await Auth.currentUserPoolUser()) as CognitoUser;
  await Auth.changePassword(user, oldPassword, newPassword);
};

interface ForgotPasswordSendCode {
  (email: string): Promise<CodeDeliveryDetails>;
}

const forgotPasswordSendCode: ForgotPasswordSendCode = async (email) => Auth.forgotPassword(email);

interface ForgotPasswordReset {
  (email: string, code: string, newPassword: string): void;
}

const forgotPasswordReset: ForgotPasswordReset = async (email, code, newPassword) =>
  Auth.forgotPasswordSubmit(email, code, newPassword);

type UploadAvatarResponse = {
  success: boolean;
  avatarURI: string;
  error: string;
};
interface UploadAvatarId {
  // userId - uuid v4 user id
  // avatarDataURI - avatar data URI
  (userId: string, avatarDataURI: string): Promise<UploadAvatarResponse>;
}

const uploadAvatarId: UploadAvatarId = async (userId, avatarDataURI) => {
  const response = await axios.post(
    `${ENDPOINTS.AVATARS}/id`,
    { userId, avatarDataURI },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response.data;
};

interface UploadAvatarToken {
  // avatarDataURI - avatar data URI
  (avatarDataURI: string): Promise<UploadAvatarResponse>;
}

const uploadAvatarToken: UploadAvatarToken = async (avatarDataURI) => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  const response = await axios.post(
    `${ENDPOINTS.AVATARS}/token`,
    { avatarDataURI },
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
  );
  return response.data;
  // if (response.status === 201 && response.data.success === 'true') return response.data;
  // throw new Error(response.data);
};

interface DeleteUser {
  (): Promise<string>;
}

const deleteUser: DeleteUser = async () => {
  const user = (await Auth.currentUserPoolUser()) as CognitoUser;
  return new Promise((resolve, reject) => {
    user.deleteUser((err, result) => {
      if (err) reject(new Error('Failed deleting user.'));
      resolve(result as string);
    });
  });
};

const value = {
  signUp,
  updateUserAttributes,
  adminUpdateUserAttributes,
  signIn,
  verifyEmailAttribute,
  signInWithGoogle,
  signOut,
  getSession: () => Auth.currentSession(),
  changePassword,
  forgotPasswordSendCode,
  forgotPasswordReset,
  uploadAvatarId,
  uploadAvatarToken,
  deleteUser,
};

const Context = createContext(value);

const Provider: React.FunctionComponent = ({ children }) => (
  <Context.Provider value={value}>{children}</Context.Provider>
);

export type { UpdateUserAttributesType };
export default { Context, Provider };
