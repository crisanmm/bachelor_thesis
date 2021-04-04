import * as Cognito from 'amazon-cognito-identity-js';
import * as Yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { UserPool } from '@shared';
import {
  FormikField,
  StyledFormWrapper,
  StyledFormHeading,
  StyledFormDescription,
  StyledForm,
} from '@components/shared';
import React from 'react';

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

const SignUpBox = () => {
  const router = useRouter();
  console.log(router);
  router.push('/sign-in');

  const handleSubmit = async (
    { email, firstName, lastName, password }: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) =>
    new Promise((resolve, reject) => {
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
          if (err) {
            console.log('error');
            console.log(err);
            reject(err);
          } else {
            console.log('data');
            console.log(data);
            resolve(data);
          }
        },
      );
    });

  return (
    <StyledFormWrapper>
      <StyledFormHeading>Sign up</StyledFormHeading>
      <StyledFormDescription>
        By creating an account you will be able to join conference booths, making your profile
        publicly visible to the other attenders.
      </StyledFormDescription>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(props): { props: FormikProps<typeof initialValues> } => (
          <StyledForm>
            <FormikField type="email" name="email" label="Email" required />
            <FormikField type="text" name="firstName" label="First name" required />
            <FormikField type="text" name="lastName" label="Last name" required />
            <FormikField type="password" name="password" label="Password" required />
            <FormikField type="password" name="passwordConfirm" label="Password Confirm" required />
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
        )}
      </Formik>
    </StyledFormWrapper>
  );
};

export default SignUpBox;
