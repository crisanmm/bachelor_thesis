import * as Yup from 'yup';
import React, { useState, useContext } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { FormikForm, StyledAlert } from '#components/shared';
import { AccountContext } from '#contexts';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 * Used only for the reset password form.
 */
const resetPasswordInitialValues = {
  code: '',
  password: '',
  passwordConfirm: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation
 * schema passed to {@link https://formik.org/ | formik}.
 * Used only for the reset password form.
 */
const resetPasswordValidationSchema = Yup.object().shape({
  code: Yup.number(),
  password: Yup.string()
    .min(8, '8 characters minimum.')
    .matches(/\d/, 'A number is required.')
    .required('A password is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    .required('Password confirm is required.'),
});

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm: React.FunctionComponent<ResetPasswordFormProps> = ({ email }) => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { forgotPasswordReset } = useContext(AccountContext.Context);

  const resetPasswordOnSubmit = async ({ code, password }: typeof resetPasswordInitialValues) => {
    try {
      await forgotPasswordReset(email, code, password);
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully changed password.
        </StyledAlert>
      ));
      setTimeout(() => router.push('/sign-in'), 3000);
    } catch (e) {
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  return (
    <Formik
      initialValues={resetPasswordInitialValues}
      validationSchema={resetPasswordValidationSchema}
      onSubmit={resetPasswordOnSubmit}
    >
      {(props: FormikProps<typeof resetPasswordInitialValues>) => (
        <>
          <FormikForm.StyledForm>
            <FormikForm.FormikField type="text" name="code" label="Verification code" required />
            <FormikForm.FormikField type="password" name="password" label="New Password" required />
            <FormikForm.FormikField
              type="password"
              name="passwordConfirm"
              label="New Password Confirm"
              required
            />
            <Button
              endIcon={<ArrowForward />}
              variant="contained"
              color="primary"
              type="submit"
              disabled={props.isSubmitting}
            >
              Reset password
            </Button>
          </FormikForm.StyledForm>
          <Alert />
        </>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
