import * as Yup from 'yup';
import React, { SetStateAction, useContext, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { FormikForm, StyledAlert } from '#components/shared';
import { AccountContext } from '#contexts';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  email: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format.').required('New email is required.'),
});

interface ChangeEmailFormProps {
  setIsCodeSent: React.Dispatch<SetStateAction<boolean>>;
}

const ChangeEmailForm: React.FunctionComponent<ChangeEmailFormProps> = ({ setIsCodeSent }) => {
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const { updateUserAttributes } = useContext(AccountContext.Context);

  const onSubmit = async ({ email }: typeof initialValues) => {
    try {
      await updateUserAttributes({ email });
      setIsCodeSent(true);
    } catch (e) {
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(props): { props: FormikProps<typeof initialValues> } => (
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
              Change email
            </Button>
          </FormikForm.StyledForm>
          <Alert />
        </>
      )}
    </Formik>
  );
};

export default ChangeEmailForm;
