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
 * Used only for the send code form.
 */
const sendCodeInitialValues = {
  email: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation
 * schema passed to {@link https://formik.org/ | formik}.
 * Used only for the send code form.
 */
const sendCodeValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format.').required('Your email is required.'),
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

interface SendCodeFormProps {
  setEmail: (email: string) => void /* eslint-disable-line */;
}

const SendCodeForm: React.FC<SendCodeFormProps> = ({ setEmail }) => {
  const [alert, setAlert] = useState<any>();
  const { forgotPasswordSendCode } = useContext(Account.Context);

  const sendCodeOnSubmit = async ({ email }: typeof sendCodeInitialValues) => {
    try {
      const data = await forgotPasswordSendCode(email);
      console.log(data);
      setEmail(email);
    } catch (e) {
      setAlert({ ...alerts.error, message: e.message });
      console.log(e);
    }
  };

  return (
    <Formik
      initialValues={sendCodeInitialValues}
      validationSchema={sendCodeValidationSchema}
      onSubmit={sendCodeOnSubmit}
    >
      {(props: FormikProps<typeof sendCodeInitialValues>) => (
        <>
          <StyledForm>
            <FormikField type="email" name="email" label="Email" required />
            <Button
              endIcon={<ArrowForward />}
              variant="contained"
              color="primary"
              type="submit"
              disabled={props.isSubmitting}
            >
              Send verification code
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

export default SendCodeForm;
