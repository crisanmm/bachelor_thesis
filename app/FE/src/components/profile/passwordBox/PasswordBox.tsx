import * as Yup from 'yup';
import React, { useContext, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button, Typography } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { FormikForm, StyledAlert } from '#components/shared';
import { AccountContext } from '#contexts';
import { StyledDivider } from './PasswordBox.style';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(8, '8 characters minimum.')
    .matches(/\d/, 'A number is required.')
    .required('Old password is required.'),
  newPassword: Yup.string()
    .min(8, '8 characters minimum.')
    .matches(/\d/, 'A number is required.')
    .required('New password is required.'),
  newPasswordConfirm: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
    .required('Password confirm is required.'),
});

const PasswordBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { changePassword } = useContext(AccountContext.Context);

  const onSubmit = async ({ oldPassword, newPassword }: typeof initialValues) => {
    try {
      await changePassword(oldPassword, newPassword);
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully changed password.
        </StyledAlert>
      ));
      setTimeout(() => router.push('/profile'), 2000);
    } catch (e) {
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  return (
    <FormikForm.StyledFormWrapper>
      <Typography variant="h5" gutterBottom>
        Change password
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        No longer have trust in your password? Change it here.
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => (
          <>
            <FormikForm.StyledForm>
              <FormikForm.FormikField
                type="password"
                name="oldPassword"
                label="Old Password"
                required
              />
              <StyledDivider />
              <FormikForm.FormikField
                type="password"
                name="newPassword"
                label="New Password"
                required
              />
              <FormikForm.FormikField
                type="password"
                name="newPasswordConfirm"
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
                change password
              </Button>
            </FormikForm.StyledForm>
            <Alert />
          </>
        )}
      </Formik>
    </FormikForm.StyledFormWrapper>
  );
};

export default PasswordBox;
