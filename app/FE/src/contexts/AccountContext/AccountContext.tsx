import React, { createContext, useEffect } from 'react';
import axios from 'axios';
import {
  CognitoUserSession,
  ISignUpResult,
  CodeDeliveryDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import Amplify, { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

const API_URI = 'https://api.think-in.me/dev';

Amplify.configure({
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_pu83KKkCb',
    userPoolWebClientId: '7bvt3iiug8uajvnlmbkg2i3fls',
    oauth: {
      domain: 'think-in.auth.eu-central-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'token',
    },
  },
});

interface SignUp {
  (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    picture: string,
  ): Promise<ISignUpResult>;
}

const signUp: SignUp = async (email, password, firstName, lastName, picture) =>
  Auth.signUp({
    username: email,
    password,
    attributes: { given_name: firstName, family_name: lastName, picture },
  });

interface UpdateUserAttributes {
  (attributes: { [key: string]: string }): Promise<string>;
}

const updateUserAttributes: UpdateUserAttributes = async (attributes) => {
  const user = (await Auth.currentUserPoolUser()) as CognitoUser;
  return Auth.updateUserAttributes(user, attributes);
};

interface VerifyEmailAttribute {
  (
    code: string, // verification code
  ): Promise<string>;
}

const verifyEmailAttribute: VerifyEmailAttribute = (code) =>
  Auth.verifyCurrentUserAttributeSubmit('email', code);

interface SignIn {
  (email: string, password: string): Promise<CognitoUserSession>;
}

const signIn: SignIn = async (email, password) => Auth.signIn({ username: email, password });

const signInWithGoogle = () =>
  Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });

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
interface UploadAvatarOnSignUp {
  // userId - uuid v4 user id
  // avatarDataURI - avatar data URI
  (userId: string, avatarDataURI: string): Promise<UploadAvatarResponse>;
}

const uploadAvatarOnSignUp: UploadAvatarOnSignUp = async (userId, avatarDataURI) => {
  const response = await axios.post(
    `${API_URI}/avatars`,
    { userId, avatarDataURI },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response.data;
};

interface UploadAvatarType {
  // avatarDataURI - avatar data URI
  (avatarDataURI: string): Promise<UploadAvatarResponse>;
}

const uploadAvatar: UploadAvatarType = async (avatarDataURI) => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  const response = await axios.post(
    `${API_URI}/avatars`,
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
  signIn,
  verifyEmailAttribute,
  signInWithGoogle,
  signOut,
  getSession: () => Auth.currentSession(),
  changePassword,
  forgotPasswordSendCode,
  forgotPasswordReset,
  uploadAvatarOnSignUp,
  uploadAvatar,
  deleteUser,
};

const Context = createContext(value);

const Provider: React.FunctionComponent = ({ children }) => {
  useEffect(() => {
    Auth.currentSession()
      .then((s) => console.log(s))
      .catch(() => {});
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default { Context, Provider };
