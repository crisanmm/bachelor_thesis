import * as AWSCognito from 'amazon-cognito-identity-js';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { UserPool } from '@shared';
import {
  FormikField,
  StyledFormWrapper,
  StyledFormHeading,
  StyledFormDescription,
  StyledForm,
  StyledAlert,
} from '@components/shared';
import { AlertTitle } from '@material-ui/lab';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  email: '',
  password: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format.').required('Your email is required.'),
  password: Yup.string().min(8, '8 characters minimum.').required('A password is required.'),
});

const alerts = {
  error: {
    severity: 'error',
    title: 'Error',
    message: '',
  },
  warning: {
    severity: 'warning',
    title: 'Warning',
    message: '',
  },
};

const SignInBox = () => {
  const [alert, setAlert] = useState<any>();

  const handleSubmit = async (
    { email, password }: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) =>
    new Promise((resolve, reject) => {
      const user = new AWSCognito.CognitoUser({
        Username: email,
        Pool: UserPool,
      });

      const authenticationDetails = new AWSCognito.AuthenticationDetails({
        Username: email,
        Password: password,
      });

      user.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          console.log('onSuccess');
          console.log(session);
          resolve(session);
        },
        onFailure: (err) => {
          console.log('onFailure');
          console.log(err);
          setAlert({ ...alerts.error, message: err.message });
          reject(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log('newPasswordRequired');
          console.log(userAttributes);
          console.log(requiredAttributes);
          setAlert({ ...alerts.warning });
          resolve({ userAttributes, requiredAttributes });
        },
      });
    });

  // TODO: handle errors
  // - UserNotConfirmedException
  // - NotAuthorizedException DONE
  return (
    <StyledFormWrapper>
      <StyledFormHeading>Sign in</StyledFormHeading>
      <StyledFormDescription>
        After you sign in you can join conference booths and message other people.
      </StyledFormDescription>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<typeof initialValues>) => (
          <>
            <StyledForm>
              <FormikField type="email" name="email" label="Email" required />
              <FormikField type="password" name="password" label="Password" required />
              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                color="primary"
                type="submit"
                disabled={props.isSubmitting}
              >
                Sign in
              </Button>
            </StyledForm>
            {alert ? (
              <StyledAlert severity={alert.severity}>
                {/* <AlertTitle>{alert.title}</AlertTitle> */}
                {alert.message}
              </StyledAlert>
            ) : null}
          </>
        )}
      </Formik>
    </StyledFormWrapper>
  );
};

export default SignInBox;
