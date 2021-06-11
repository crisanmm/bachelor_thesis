import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '#contexts';
import { getAttributesFromSession } from '#utils';

type useUserReturnType = {
  // true if user is logged in, false otherwise
  isLoggedIn: boolean;
  // true if user is logging in, false otherwise
  isLoggingIn: boolean;
  // true if user is logged with a third party (e.g. social providers like Facebook, Google),
  // false otherwise
  isSignedInWithAThirdParty: boolean | undefined;
  // true if user is in the admin group,
  // false otherwise
  isAdmin: boolean | undefined;
};

interface useUserType {
  (): useUserReturnType;
}

const useUser: useUserType = () => {
  const { getSession } = useContext(AccountContext.Context);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true);
  const [isSignedInWithAThirdParty, setIsSignedInWithAThirdParty] = useState<boolean>();
  const [isAdmin, setIsAdmin] = useState<boolean>();

  useEffect(() => {
    getSession()
      .then((userSession) => {
        const attributes = getAttributesFromSession(userSession);
        setIsLoggedIn(true);
        setIsLoggingIn(false);
        setIsSignedInWithAThirdParty(attributes.id.toLowerCase().startsWith('google'));
        setIsAdmin(!!attributes.groups?.includes('admin'));
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setIsLoggingIn(false));
  }, []);

  return { isLoggedIn, isLoggingIn, isSignedInWithAThirdParty, isAdmin };
};

export default useUser;
