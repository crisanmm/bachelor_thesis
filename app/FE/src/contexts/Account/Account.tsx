import React, { createContext } from 'react';
import {
  CognitoUserSession,
  ISignUpResult,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CodeDeliveryDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

const UserPool = new CognitoUserPool({
  UserPoolId: 'eu-central-1_bzl57SX04',
  ClientId: 'sdpfrpukifetupagvhgh6vh5d',
});

interface GetUser {
  (email: string): CognitoUser;
}

const getUser: GetUser = (email) =>
  new CognitoUser({
    Username: email.toLowerCase(),
    Pool: UserPool,
  });

interface SignUp {
  (email: string, firstName: string, lastName: string, password: string): Promise<ISignUpResult>;
}

const signUp: SignUp = async (email, firstName, lastName, password) =>
  new Promise((resolve, reject) => {
    const firstNameAttribute: CognitoUserAttribute = {
      Name: 'given_name',
      Value: firstName,
    };

    const lastNameAttribute: CognitoUserAttribute = {
      Name: 'family_name',
      Value: lastName,
    };

    UserPool.signUp(
      email,
      password,
      [firstNameAttribute, lastNameAttribute],
      [] as CognitoUserAttribute[],
      (err: Error | undefined, data: ISignUpResult | undefined) => {
        if (err) reject(err);
        resolve(data as ISignUpResult);
      },
    );
  });

interface SignIn {
  (email: string, password: string): Promise<CognitoUserSession>;
}

const signIn: SignIn = async (email, password) =>
  new Promise((resolve, reject) => {
    const user = getUser(email);

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
      // newPasswordRequired: (userAttributes, requiredAttributes) => {
      //   resolve({ userAttributes, requiredAttributes });
      // },
    });
  });

interface SignOut {
  (): boolean;
}

const signOut: SignOut = () => {
  const user = UserPool.getCurrentUser();
  if (user) {
    user.signOut();
    return true;
  }
  return false;
};

interface GetSession {
  (): Promise<CognitoUserSession>;
}

const getSession: GetSession = async () =>
  new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error | null, data: CognitoUserSession | null) => {
        if (err) reject(err);
        resolve(data as CognitoUserSession);
      });
    }
    reject({ code: 'xNotSignedInException', message: 'You are not signed in.' });
  });

interface ForgotPasswordSendCode {
  (email: string): Promise<CodeDeliveryDetails>;
}

const forgotPasswordSendCode: ForgotPasswordSendCode = async (email) =>
  new Promise((resolve, reject) => {
    getUser(email).forgotPassword({
      onSuccess(data: CodeDeliveryDetails) {
        resolve(data);
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
interface ForgotPasswordReset {
  (email: string, code: string, newPassword: string): void;
}
const forgotPasswordReset: ForgotPasswordReset = async (email, code, newPassword) =>
  new Promise<void>((resolve, reject) => {
    getUser(email).confirmPassword(code, newPassword, {
      onSuccess() {
        resolve();
      },
      onFailure(err) {
        reject(err);
      },
    });
  });

const value = { signUp, signIn, signOut, getSession, forgotPasswordSendCode, forgotPasswordReset };

const Context = createContext(value);

const Provider: React.FunctionComponent = ({ children }) => (
  <Context.Provider value={value}>{children}</Context.Provider>
);

export default { Context, Provider };
