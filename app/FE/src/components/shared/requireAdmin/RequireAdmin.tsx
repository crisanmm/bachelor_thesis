import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '#hooks';

const RequireAdmin: React.FunctionComponent = ({ children }) => {
  const router = useRouter();
  const { isLoggingIn, isAdmin } = useUser();

  if (isLoggingIn) {
    // loading user state
    return <></>;
  }

  if (!isAdmin) {
    // if user is not an admin
    router.push('/');
    return <></>;
  }

  return <>{children}</>;
};

export default RequireAdmin;
