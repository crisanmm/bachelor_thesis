import * as Yup from 'yup';
import React, { useContext, useState } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { FormikForm, StyledAlert } from '@components/shared';
import { Account } from '@contexts';

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
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
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
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { signUp } = useContext(Account.Context);

  const onSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      await signUp(values);
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully created an account.
        </StyledAlert>
      ));
      setTimeout(() => router.push('/sign-in'), 2000);
    } catch (e) {
      console.log(e);
      switch (e.code) {
        case 'UsernameExistsException':
          setAlert(() => () => (
            <StyledAlert severity="error" title="Error">
              {e.message}
            </StyledAlert>
          ));
          break;
      }
    }
  };

  return (
    <FormikForm.StyledFormWrapper>
      <FormikForm.StyledFormHeading>Sign up</FormikForm.StyledFormHeading>
      <FormikForm.StyledFormDescription>
        By creating an account you will be able to join conference booths, making your profile
        publicly visible to the other attenders.
      </FormikForm.StyledFormDescription>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => (
          <>
            <FormikForm.StyledForm>
              <FormikForm.FormikField type="email" name="email" label="Email" required />
              <FormikForm.FormikField type="text" name="firstName" label="First name" required />
              <FormikForm.FormikField type="text" name="lastName" label="Last name" required />
              <FormikForm.FormikField type="password" name="password" label="Password" required />
              <FormikForm.FormikField
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
            </FormikForm.StyledForm>
            <Alert />
          </>
        )}
      </Formik>
    </FormikForm.StyledFormWrapper>
  );
};

export default SignUpBox;
