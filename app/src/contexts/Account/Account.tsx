import { createContext } from 'react';
import * as Cognito from 'amazon-cognito-identity-js';
import { UserPool } from '@shared';

const Context = createContext(undefined);

const getUser = (email: string) =>
  new Cognito.CognitoUser({
    Username: email.toLowerCase(),
    Pool: UserPool,
  });

const signUp = async ({ email, firstName, lastName, password }) =>
  new Promise<Cognito.ISignUpResult>((resolve, reject) => {
    const firstNameAttribute: Cognito.CognitoUserAttribute = {
      Name: 'given_name',
      Value: firstName,
    };

    const lastNameAttribute: Cognito.CognitoUserAttribute = {
      Name: 'family_name',
      Value: lastName,
    };

    UserPool.signUp(
      email,
      password,
      [firstNameAttribute, lastNameAttribute],
      [] as Cognito.CognitoUserAttribute[],
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      },
    );
  });

const signIn = async ({ email, password }) =>
  new Promise<Cognito.CognitoUserSession>((resolve, reject) => {
    const user = getUser(email);

    const authenticationDetails = new Cognito.AuthenticationDetails({
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

const signOut = () => {
  const user = UserPool.getCurrentUser();
  user.signOut();
};

const getSession = async () =>
  new Promise<Cognito.CognitoUserSession>((resolve, reject) => {
    const user = UserPool.getCurrentUser();
    if (user !== null) {
      user.getSession((err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }
    reject({ code: 'xNotSignedInException', message: 'You are not signed in.' });
  });

const forgotPasswordSendCode = async (email) =>
  new Promise((resolve, reject) => {
    getUser(email).forgotPassword({
      onSuccess(data) {
        resolve(data);
      },
      onFailure(err) {
        reject(err);
      },
      inputVerificationCode(data) {
        resolve(data);
      },
    });
  });

const forgotPasswordReset = async (email, code, newPassword) =>
  new Promise((resolve, reject) => {
    getUser(email).confirmPassword(code, newPassword, {
      onSuccess() {
        resolve(true);
      },
      onFailure(err) {
        reject(err);
      },
    });
  });

const value = { signUp, signIn, signOut, getSession, forgotPasswordSendCode, forgotPasswordReset };

const Provider = ({ children }) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { Context, Provider };
