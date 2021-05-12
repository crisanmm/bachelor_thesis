import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@contexts';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

type useUserReturnType = {
  // true if user is logged in, false otherwise
  isLoggedIn: boolean;
  // true if user is logging in, false otherwise
  isLoggingIn: boolean;
  // CognitoUserSession if the user is logged in, undefined otherwise
  userSession: CognitoUserSession | undefined;
};

interface useUserType {
  (): useUserReturnType;
}

const useUser: useUserType = () => {
  const { getSession } = useContext(AccountContext.Context);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true);
  const [userSession, setUserSession] = useState<CognitoUserSession>();

  useEffect(() => {
    getSession()
      .then((userSession) => {
        setIsLoggedIn(true);
        setIsLoggingIn(false);
        setUserSession(userSession);
      })
      .catch((error) => {
        setIsLoggingIn(false);
        console.log('🚀  -> file: useUser.tsx  -> line 15  -> err', error);
      });
  }, []);

  return { isLoggedIn, isLoggingIn, userSession };
};

export default useUser;
