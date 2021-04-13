import * as Yup from 'yup';
import React, { useState, useContext } from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { FormikForm, StyledAlert, StyledLink } from '@components/shared';
import { Account } from '@contexts';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  email: '',
  password: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format.').required('Your email is required.'),
  password: Yup.string().min(8, '8 characters minimum.').required('A password is required.'),
});

const SignInBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { signIn } = useContext(Account.Context);

  const onSubmit = async (
    { email, password }: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      await signIn(email, password);
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully signed in.
        </StyledAlert>
      ));
      setTimeout(() => router.push('/'), 2000);
    } catch (e) {
      // possible errors
      // - UserNotConfirmedException
      // - NotAuthorizedException
      console.log(e);
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  return (
    <FormikForm.StyledFormWrapper>
      <FormikForm.StyledFormHeading>Sign in</FormikForm.StyledFormHeading>
      <FormikForm.StyledFormDescription>
        After you sign in you can join conference booths and message other people.
      </FormikForm.StyledFormDescription>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props: FormikProps<typeof initialValues>) => (
          <>
            <FormikForm.StyledForm>
              <FormikForm.FormikField type="email" name="email" label="Email" required />
              <FormikForm.FormikField type="password" name="password" label="Password" required />
              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                color="primary"
                type="submit"
                disabled={props.isSubmitting}
              >
                Sign in
              </Button>
            </FormikForm.StyledForm>
            <StyledLink href="/forgot-password" color="textSecondary">
              Forgot password?
            </StyledLink>
            <Alert />
          </>
        )}
      </Formik>
    </FormikForm.StyledFormWrapper>
  );
};

export default SignInBox;
