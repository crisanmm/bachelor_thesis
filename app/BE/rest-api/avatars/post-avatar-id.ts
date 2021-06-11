import parseDataUrl from 'parse-data-url';
import {
  makeResponse,
  loadEnvironmentVariables,
  uploadAvatarToS3AndUpdateUserAttribute,
  cognitoIdentityServiceProvider,
} from '../shared';

loadEnvironmentVariables();

/**
 * This function is run when avatar is uploaded at sign-up, before user is confirmed.
 */
const postAvatarId = async (event: any) => {
  console.log(event);

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  const parsedDataUrl = parseDataUrl(requestBody.avatarDataURI);
  if (!parsedDataUrl) return makeResponse(400, false, { error: 'Failed decoding avatarURI' });

  // make sure that user is not confirmed before uploading avatar
  let response;
  try {
    response = (
      await cognitoIdentityServiceProvider
        .adminGetUser({ UserPoolId: process.env.COGNITO_USER_POOL_ID!, Username: requestBody.userId })
        .promise()
    ).$response;
  } catch (e) {
    console.log('🚀  -> file: post-avatar.ts  -> line 90  -> e', e);
    return makeResponse(400, false, {
      error: `Couldn't find user with id ${requestBody.userId}.`,
    });
  }

  console.log('🚀  -> file: post-avatar.ts  -> line 84  -> response', response);
  if (response.data) {
    const userConfirmed = response.data.UserStatus!;

    switch (userConfirmed) {
      case 'UNCONFIRMED':
        const avatarURI = await uploadAvatarToS3AndUpdateUserAttribute(
          requestBody.userId as string,
          parsedDataUrl.toBuffer(),
        );
        return makeResponse(201, true, { avatarURI });

      default:
        return makeResponse(403, false, {
          error: 'Can upload avatar using only ID only when user is in UNCONFIRMED status.',
        });
    }
  }
};

export { postAvatarId };
