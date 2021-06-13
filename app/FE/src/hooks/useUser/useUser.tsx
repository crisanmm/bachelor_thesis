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
  const [state, setState] = useState<useUserReturnType>({
    isLoggedIn: false,
    isLoggingIn: true,
    isSignedInWithAThirdParty: undefined,
    isAdmin: undefined,
  });

  useEffect(() => {
    getSession()
      .then((userSession) => {
        const attributes = getAttributesFromSession(userSession);
        setState((state) => ({
          ...state,
          isLoggedIn: true,
          isLoggingIn: false,
          isSignedInWithAThirdParty: attributes.id.toLowerCase().startsWith('google'),
          isAdmin: !!attributes.groups?.includes('admin'),
        }));
      })
      .catch(() => setState((state) => ({ ...state, isLoggedIn: false })))
      .finally(() => setState((state) => ({ ...state, isLoggingIn: false })));
  }, []);

  return state;
};

export default useUser;
