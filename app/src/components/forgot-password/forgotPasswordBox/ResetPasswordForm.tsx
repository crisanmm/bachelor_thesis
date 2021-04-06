import * as Yup from 'yup';
import React, { useState, useContext } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { FormikField, StyledForm, StyledAlert } from '@components/shared';
import { Account } from '@contexts';
import { AlertTitle } from '@material-ui/lab';
import StyledButton from './ResetPasswordForm.style';

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

interface ResetPasswordFormProps {
  setEmail: (email: string) => void /* eslint-disable-line */;
  email: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email, setEmail }) => {
  const router = useRouter();
  const [alert, setAlert] = useState<any>();
  const { forgotPasswordReset } = useContext(Account.Context);

  const resetPasswordOnSubmit = async ({ code, password }: typeof resetPasswordInitialValues) => {
    try {
      await forgotPasswordReset(email, code, password);
      console.log('success');
      setAlert({ ...alerts.success, message: 'Successfully changed password.' });
      setTimeout(() => router.push('/'), 3000);
    } catch (e) {
      console.log(e);
      setAlert({ ...alerts.error, message: e.message });
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
          <StyledForm>
            <StyledButton onClick={() => setEmail(undefined)}>BACK</StyledButton>
            <FormikField type="text" name="code" label="Verification code" required />
            <FormikField type="password" name="password" label="New Password" required />
            <FormikField
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
  );
};

export default ResetPasswordForm;
