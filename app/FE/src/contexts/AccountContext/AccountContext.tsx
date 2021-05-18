import React, { createContext, useEffect } from 'react';
import {
  CognitoUserSession,
  ISignUpResult,
  CodeDeliveryDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import Amplify, { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

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
  (
    user: CognitoUser,
    attributes: {
      [key: string]: string;
    },
  ): Promise<string>;
}

const updateUserAttributes: UpdateUserAttributes = async (user, attributes) =>
  Auth.updateUserAttributes(user, attributes);

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

interface ForgotPasswordSendCode {
  (email: string): Promise<CodeDeliveryDetails>;
}

const forgotPasswordSendCode: ForgotPasswordSendCode = async (email) => Auth.forgotPassword(email);

interface ForgotPasswordReset {
  (email: string, code: string, newPassword: string): void;
}

const forgotPasswordReset: ForgotPasswordReset = async (email, code, newPassword) =>
  Auth.forgotPasswordSubmit(email, code, newPassword);

const value = {
  signUp,
  updateUserAttributes,
  signIn,
  signInWithGoogle,
  signOut,
  getSession: () => Auth.currentSession(),
  forgotPasswordSendCode,
  forgotPasswordReset,
};

const Context = createContext(value);

const Provider: React.FunctionComponent = ({ children }) => {
  useEffect(() => {
    Auth.currentSession().then((s) => console.log(s));
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default { Context, Provider };
