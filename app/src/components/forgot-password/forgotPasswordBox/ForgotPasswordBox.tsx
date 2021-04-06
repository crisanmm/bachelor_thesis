import React, { useState } from 'react';
import { StyledFormWrapper, StyledFormHeading, StyledFormDescription } from '@components/shared';
import SendCodeForm from './SendCodeForm';
import ResetPasswordForm from './ResetPasswordForm';

const ForgotPasswordBox = () => {
  const [email, setEmail] = useState<string>('a');

  return (
    <StyledFormWrapper>
      <StyledFormHeading>Reset password</StyledFormHeading>
      <StyledFormDescription>
        {email
          ? 'Check your email for a verification code.'
          : "Don't stress out, you will reset your password easily 😊"}
      </StyledFormDescription>
      {email ? (
        <ResetPasswordForm setEmail={setEmail} email={email} />
      ) : (
        <SendCodeForm setEmail={setEmail} />
      )}
    </StyledFormWrapper>
  );
};

export default ForgotPasswordBox;
