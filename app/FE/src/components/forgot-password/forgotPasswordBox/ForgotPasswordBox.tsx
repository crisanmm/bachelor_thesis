import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { FormikForm } from '#components/shared';
import SendCodeForm from './SendCodeForm';
import ResetPasswordForm from './ResetPasswordForm';

const ForgotPasswordBox: React.FunctionComponent = () => {
  const [email, setEmail] = useState<string>();

  return (
    <FormikForm.StyledFormWrapper>
      <Typography variant="h5" gutterBottom>
        Reset password
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        {email
          ? 'Check your email for a verification code.'
          : "Don't stress out, you will reset your password easily!"}
      </Typography>
      {email ? <ResetPasswordForm email={email} /> : <SendCodeForm setEmail={setEmail} />}
    </FormikForm.StyledFormWrapper>
  );
};

export default ForgotPasswordBox;
