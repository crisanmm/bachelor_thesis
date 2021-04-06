import * as Yup from 'yup';
import React, { useState, useContext } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import {
  FormikField,
  StyledFormWrapper,
  StyledFormHeading,
  StyledFormDescription,
  StyledForm,
  StyledAlert,
  StyledLink,
} from '@components/shared';
import { Account } from '@contexts';
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
  success: {
    severity: 'success',
    title: 'Success.',
    message: 'Logged in successfully.',
  },
  error: {
    severity: 'error',
    title: 'Error.',
    message: '',
  },
  warning: {
    severity: 'warning',
    title: 'Warning.',
    message: '',
  },
};

const SignInBox = () => {
  const router = useRouter();
  const [alert, setAlert] = useState<any>();
  const { signIn } = useContext(Account.Context);

  const onSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      const signInResult = await signIn(values);
      console.log('resolved');
      setAlert({ ...alerts.success });
      console.log(signInResult);
      router.push('/');
    } catch (e) {
      console.log('rejected');
      switch (e.code) {
        case 'UserNotConfirmedException':
          e.title = 'Error';
          e.message = 'Could not sign in. Please confirm your account.';
          break;
      }
      setAlert({ ...alerts.error, message: e.message });
      console.log(e);
    }
  };

  // TODO: handle errors
  // - UserNotConfirmedException DONE
  // - NotAuthorizedException
  return (
    <StyledFormWrapper>
      <StyledFormHeading>Sign in</StyledFormHeading>
      <StyledFormDescription>
        After you sign in you can join conference booths and message other people.
      </StyledFormDescription>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
            <StyledLink href="/forgot-password" color="textSecondary">
              Forgot password?
            </StyledLink>
            {alert ? (
              <StyledAlert severity={alert.severity}>
                <AlertTitle>{alert.title}</AlertTitle>
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
