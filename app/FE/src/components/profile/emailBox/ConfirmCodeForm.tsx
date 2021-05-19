import * as Yup from 'yup';
import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { FormikForm, StyledAlert } from '#components/shared';
import { AccountContext } from '#contexts';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 * Used only for the send code form.
 */
const initialValues = {
  code: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation
 * schema passed to {@link https://formik.org/ | formik}.
 * Used only for the send code form.
 */
const validationSchema = Yup.object().shape({
  code: Yup.string().required('The verification code is required.'),
});

const ConfirmCodeForm: React.FunctionComponent = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { verifyEmailAttribute } = useContext(AccountContext.Context);

  const sendCodeOnSubmit = async ({ code }: typeof initialValues) => {
    try {
      await verifyEmailAttribute(code);
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully changed email.
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={sendCodeOnSubmit}
    >
      {(props: FormikProps<typeof initialValues>) => (
        <>
          <FormikForm.StyledForm>
            <FormikForm.FormikField type="code" name="code" label="Verification code" required />
            <Button
              endIcon={<ArrowForward />}
              variant="contained"
              color="primary"
              type="submit"
              disabled={props.isSubmitting}
            >
              change email
            </Button>
          </FormikForm.StyledForm>
          <Alert />
        </>
      )}
    </Formik>
  );
};

export default ConfirmCodeForm;
