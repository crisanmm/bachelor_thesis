import * as Yup from 'yup';
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
} from '@components/shared';
import React, { useContext, useState } from 'react';
import { Account } from '@contexts';
import { AlertTitle } from '@material-ui/lab';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  passwordConfirm: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Your first name is required.'),
  lastName: Yup.string().required('Your last name is required.'),
  email: Yup.string().email('Invalid email format.').required('Your email is required.'),
  password: Yup.string()
    .min(8, '8 characters minimum.')
    .matches(/\d/, 'A number is required.')
    .required('A password is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    .required('Password confirm is required.'),
});

const alerts = {
  success: {
    severity: 'success',
    title: 'Success.',
    message: 'Email confirmation sent.',
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

const SignUpBox = () => {
  const router = useRouter();
  const [alert, setAlert] = useState<any>();
  const { signUp } = useContext(Account.Context);

  const onSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      const signUpResult = await signUp(values);
      console.log('resolved');
      setAlert({ ...alerts.success });
      console.log(signUpResult);
      router.push('/sign-in');
    } catch (e) {
      console.log('rejected');
      switch (e.code) {
        case 'UsernameExistsException':
          break;
      }
      setAlert({ ...alerts.error, message: e.message });
      console.log(e);
    }
  };

  return (
    <StyledFormWrapper>
      <StyledFormHeading>Sign up</StyledFormHeading>
      <StyledFormDescription>
        By creating an account you will be able to join conference booths, making your profile
        publicly visible to the other attenders.
      </StyledFormDescription>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => (
          <>
            <StyledForm>
              <FormikField type="email" name="email" label="Email" required />
              <FormikField type="text" name="firstName" label="First name" required />
              <FormikField type="text" name="lastName" label="Last name" required />
              <FormikField type="password" name="password" label="Password" required />
              <FormikField
                type="password"
                name="passwordConfirm"
                label="Password Confirm"
                required
              />
              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                color="primary"
                type="submit"
                disabled={props.isSubmitting}
              >
                Sign up
              </Button>
            </StyledForm>
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

export default SignUpBox;
