import React, { useState } from 'react';
import { FormikForm } from '@components/shared';
import SendCodeForm from './SendCodeForm';
import ResetPasswordForm from './ResetPasswordForm';

const ForgotPasswordBox = () => {
  const [email, setEmail] = useState<string>();

  return (
    <FormikForm.StyledFormWrapper>
      <FormikForm.StyledFormHeading>Reset password</FormikForm.StyledFormHeading>
      <FormikForm.StyledFormDescription>
        {email
          ? 'Check your email for a verification code.'
          : "Don't stress out, you will reset your password easily 😊"}
      </FormikForm.StyledFormDescription>
      {email ? <ResetPasswordForm email={email} /> : <SendCodeForm setEmail={setEmail} />}
    </FormikForm.StyledFormWrapper>
  );
};

export default ForgotPasswordBox;
