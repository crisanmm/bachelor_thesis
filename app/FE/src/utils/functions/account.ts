import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { HeaderChatType } from '#components/index/chatManager/shared';
import { ENDPOINTS } from '../api';

interface UserAttributes {
  token: string;
  picture: string;
  id: string;
  email: string;
  emailVerified: boolean;
  givenName: string;
  familyName: string;
  groups?: string[];
  roles?: string[];
  preferredRole?: string;
  customFacebook?: string;
  customLinkedin?: string;
  customPhone?: string;
  customJob?: string;
  customLanguage?: string;
}

interface GetAttributesFromSession {
  (userSession: CognitoUserSession): UserAttributes;
}

/**
 *
 * @param userSession UserSession returned from Cognito getSession()
 * @returns Various user attributes, see this function's return type defined in TypeScript
 */
const getAttributesFromSession: GetAttributesFromSession = (userSession) => {
  const {
    picture,
    'cognito:username': id,
    email,
    'email_verified': emailVerified,
    'given_name': givenName,
    'family_name': familyName,
    'cognito:groups': groups,
    'cognito:roles': roles,
    'cognito:preferred_role': preferredRole,
    'custom:custom_facebook': customFacebook,
    'custom:custom_linkedin': customLinkedin,
    'custom:custom_phone': customPhone,
    'custom:custom_job': customJob,
    'custom:custom_language': customLanguage,
  } = userSession.getIdToken().payload;
  return {
    token: userSession.getIdToken().getJwtToken(),
    picture,
    id,
    email,
    emailVerified,
    givenName,
    familyName,
    groups,
    roles,
    preferredRole,
    customFacebook,
    customLinkedin,
    customPhone,
    customJob,
    customLanguage,
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

interface GetUserLanguage {
  (user: UserAttributes): string;
}

/**
 * Get user language based on user session/browser language/fallback
 * @param user UserAttributes as returned from getAttributesFromSession()
 * @returns ISO-639-1 language code
 */
const getUserLanguage: GetUserLanguage = (user) => {
  if (user.customLanguage) return user.customLanguage;
  if (window.navigator.language) return window.navigator.language.split('-')[0];
  return 'en';
};

const globalHeaderChat = {
  user: {
    id: 'global',
    givenName: 'Global',
    familyName: 'Chat',
    email: 'global@think-in.me',
    emailVerified: true,
    picture: `${ENDPOINTS.S3_CHATS_BUCKET}/avatars/global.jpg`,
  },
  notifications: 0,
  selected: true,
  online: true,
};

interface ComputeStageHeaderChat {
  (stageId: string): HeaderChatType;
}

const computeStageHeaderChat: ComputeStageHeaderChat = (stageId) => ({
  user: {
    id: stageId,
    givenName: stageId[0].toUpperCase() + stageId.slice(1),
    familyName: 'chat',
    email: 'stage@think-in.me',
    emailVerified: true,
    picture: `${ENDPOINTS.S3_CHATS_BUCKET}/avatars/stage.jpg`,
  },
  notifications: 0,
  selected: false,
  online: true,
});

interface GetPersistedHeaderChats {
  (stageId: string): HeaderChatType[];
}

const getPersistedHeaderChats: GetPersistedHeaderChats = (stageId) => {
  // Make sure this is only run on browser
  if (typeof window !== 'undefined' && localStorage.getItem('headerChats') !== null) {
    const headerChats = JSON.parse(localStorage.getItem('headerChats') as string);
    headerChats.splice(1, 0, computeStageHeaderChat(stageId));
    return headerChats;
  }
  return [globalHeaderChat, computeStageHeaderChat(stageId)];
};
interface SetPersistedHeaderChats {
  (headerChats: HeaderChatType[]): void;
}

const setPersistedHeaderChats: SetPersistedHeaderChats = (headerChats) => {
  // Make sure this is only rubn on browser
  if (typeof window !== 'undefined') {
    // Remove stage chat before persisting header chats as it varies.
    const processedHeaderChats = headerChats
      .filter((headerChat) => headerChat.user.email !== 'stage@think-in.me')
      .map((headerChat) => ({ ...headerChat, selected: false }));
    processedHeaderChats[0].selected = true;
    console.log('🚀  -> file: account.ts  -> line 119  -> processedHeaderChats', processedHeaderChats);
    localStorage.setItem('headerChats', JSON.stringify(processedHeaderChats));
  }
};

export {
  getUserLanguage,
  getAttributesFromSession,
  computeAttenderDisplayName,
  getPersistedHeaderChats,
  setPersistedHeaderChats,
};
export type { UserAttributes, ComputeAttenderDisplayName };
