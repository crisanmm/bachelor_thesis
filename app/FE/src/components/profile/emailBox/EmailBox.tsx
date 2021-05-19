import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { FormikForm } from '#components/shared';
import ChangeEmailForm from './ChangeEmailForm';
import ConfirmCodeForm from './ConfirmCodeForm';

const EmailBox = () => {
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);

  return (
    <FormikForm.StyledFormWrapper>
      <Typography variant="h5" gutterBottom>
        Change email
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        {isCodeSent
          ? 'Check your email for a verification code.'
          : 'Input your new email address.'}
      </Typography>
      {!isCodeSent ? <ChangeEmailForm setIsCodeSent={setIsCodeSent} /> : <ConfirmCodeForm />}
    </FormikForm.StyledFormWrapper>
  );
};

export default EmailBox;
