import { useContext, useEffect, useState } from 'react';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AccountContext } from '#contexts';

type useUserReturnType = {
  // true if user is logged in, false otherwise
  isLoggedIn: boolean;
  // true if user is logging in, false otherwise
  isLoggingIn: boolean;
  // true if user is logged with a third party (e.g. social providers like Facebook, Google),
  // false otherwise
  isSignedInWithAThirdParty: boolean | undefined;
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
  const [isSignedInWithAThirdParty, setIsSignedInWithAThirdParty] = useState<boolean>();
  const [userSession, setUserSession] = useState<CognitoUserSession>();

  useEffect(() => {
    getSession()
      .then((userSession) => {
        setIsLoggedIn(true);
        setIsLoggingIn(false);
        setUserSession(userSession);
        setIsSignedInWithAThirdParty(
          (userSession.getIdToken().payload['cognito:username'] as string).toLowerCase().startsWith('google'),
        );
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setIsLoggingIn(false));
  }, []);

  return { isLoggedIn, isLoggingIn, isSignedInWithAThirdParty, userSession };
};

export default useUser;
