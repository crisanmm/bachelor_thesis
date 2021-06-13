import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '#hooks';

const RequireAuthentication: React.FunctionComponent = ({ children }) => {
  const router = useRouter();
  const { isLoggingIn, isLoggedIn } = useUser();

  if (isLoggingIn) {
    // loading user state
    return <></>;
  }

  if (!isLoggedIn) {
    // if user is not logged in, redirect to index page
    router.push('/');
    return <></>;
  }

  return <>{children}</>;
};

export default RequireAuthentication;
