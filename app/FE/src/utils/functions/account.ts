import { CognitoUserSession } from 'amazon-cognito-identity-js';

interface UserAttributes {
  picture: string;
  id: string;
  email: string;
  emailVerified: boolean;
  givenName: string;
  familyName: string;
  customFacebook?: string;
  customLinkedin?: string;
  customPhone?: string;
  customJob?: string;
}

interface GetAttributesFromSession {
  (userSession: CognitoUserSession): UserAttributes;
}

/**
 *
 * @param userSession UserSession return from getSession()
 * @returns Various user attributes, see this function's return type defined in TypeScript
 */
const getAttributesFromSession: GetAttributesFromSession = (userSession) => {
  const {
    picture,
    'sub': id,
    email,
    'email_verified': emailVerified,
    'given_name': givenName,
    'family_name': familyName,
    'custom:custom_facebook': customFacebook,
    'custom:custom_linkedin': customLinkedin,
    'custom:custom_phone': customPhone,
    'custom:custom_job': customJob,
  } = userSession.getIdToken().payload;
  return {
    picture,
    id,
    email,
    emailVerified,
    givenName,
    familyName,
    customFacebook,
    customLinkedin,
    customPhone,
    customJob,
  };
};

interface ComputeAttenderDisplayName {
  ({ givenName, familyName }: { givenName: string; familyName: string }): string;
}

const computeAttenderDisplayName: ComputeAttenderDisplayName = ({ givenName, familyName }) => {
  const _givenName = givenName.toUpperCase()[0] + givenName.toLowerCase().slice(1);
  const _familyName = familyName.toUpperCase()[0] + familyName.toLowerCase().slice(1);
  return `${_givenName} ${_familyName}`;
};

export { getAttributesFromSession, computeAttenderDisplayName };
export type { UserAttributes, ComputeAttenderDisplayName };
