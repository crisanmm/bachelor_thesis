import * as Yup from 'yup';
import React, { useState, useContext } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { FormikForm, StyledAlert } from '@components/shared';
import { Account } from '@contexts';

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

interface SendCodeFormProps {
  setEmail: (email: string) => void /* eslint-disable-line */;
}

const SendCodeForm: React.FC<SendCodeFormProps> = ({ setEmail }) => {
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { forgotPasswordSendCode } = useContext(Account.Context);

  const sendCodeOnSubmit = async ({ email }: typeof sendCodeInitialValues) => {
    try {
      await forgotPasswordSendCode(email);
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully sent verification code to provided email.
        </StyledAlert>
      ));
      setTimeout(() => setEmail(email), 2000);
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
      initialValues={sendCodeInitialValues}
      validationSchema={sendCodeValidationSchema}
      onSubmit={sendCodeOnSubmit}
    >
      {(props: FormikProps<typeof sendCodeInitialValues>) => (
        <>
          <FormikForm.StyledForm>
            <FormikForm.FormikField type="email" name="email" label="Email" required />
            <Button
              endIcon={<ArrowForward />}
              variant="contained"
              color="primary"
              type="submit"
              disabled={props.isSubmitting}
            >
              Send verification code
            </Button>
          </FormikForm.StyledForm>
          <Alert />
        </>
      )}
    </Formik>
  );
};

export default SendCodeForm;
