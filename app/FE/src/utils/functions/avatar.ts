import axios from 'axios';

const API_URI = 'https://api.think-in.me/dev';

const getAvatarAltText = (userName: string) => `${userName}'s avatar`;

const getAvatarURI = (id: string) =>
  `https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/${id}.jpg`;

type UploadAvatarResponse = {
  success: boolean;
  avatarURI: string;
  error: string;
};
interface UploadAvatarOnSignUp {
  // id - uuid v4 of the user
  // avatarDataURI - avatar data URI
  (id: string, avatarDataURI: string): Promise<UploadAvatarResponse>;
}

const uploadAvatarOnSignUp: UploadAvatarOnSignUp = async (id, avatarDataURI) => {
  const response = await axios.post(
    `${API_URI}/avatars`,
    { id, avatarDataURI },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response.data;
};

interface UploadAvatarType {
  // token - user's ID token
  // avatarDataURI - avatar data URI
  (token: string, avatarDataURI: string): Promise<UploadAvatarResponse>;
}

const uploadAvatar: UploadAvatarType = async (token, avatarDataURI) => {
  const response = await axios.post(
    `${API_URI}/avatars`,
    { avatarDataURI },
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
  );
  return response.data;
  // if (response.status === 201 && response.data.success === 'true') return response.data;
  // throw new Error(response.data);
};

export { getAvatarAltText, getAvatarURI, uploadAvatarOnSignUp, uploadAvatar };
