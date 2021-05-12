import React, { createContext } from 'react';
import {
  CognitoUserSession,
  ISignUpResult,
  CodeDeliveryDetails,
} from 'amazon-cognito-identity-js';
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_bzl57SX04',
    userPoolWebClientId: 'sdpfrpukifetupagvhgh6vh5d',
  },
});

interface SignUp {
  (email: string, firstName: string, lastName: string, password: string): Promise<ISignUpResult>;
}

const signUp: SignUp = async (email, firstName, lastName, password) =>
  Auth.signUp({
    username: email,
    password,
    attributes: { given_name: firstName, family_name: lastName },
  });

interface SignIn {
  (email: string, password: string): Promise<CognitoUserSession>;
}

const signIn: SignIn = async (email, password) => Auth.signIn({ username: email, password });

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
  signIn,
  signOut,
  getSession: () => Auth.currentSession(),
  forgotPasswordSendCode,
  forgotPasswordReset,
};

const Context = createContext(value);

const Provider: React.FunctionComponent = ({ children }) => (
  <Context.Provider value={value}>{children}</Context.Provider>
);

export default { Context, Provider };
