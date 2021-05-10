const getAvatarAltText = (userName: string) => `${userName}'s avatar`;

const getAvatarURI = (id: string) =>
  `https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/${id}.jpg`;

export { getAvatarAltText, getAvatarURI };
