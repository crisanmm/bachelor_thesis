import * as JWT from 'jsonwebtoken';
import parseDataUrl from 'parse-data-url';
import { makeResponse, loadEnvironmentVariables, uploadAvatarToS3AndUpdateUserAttribute } from '../shared';

loadEnvironmentVariables();

/**
 * This function is run when avatar is uploaded after the user is signed up.
 */
const postAvatarToken = async (event: any) => {
  console.log(event);

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  const parsedDataUrl = parseDataUrl(requestBody.avatarDataURI);
  if (!parsedDataUrl) return makeResponse(400, false, { error: 'Failed decoding avatarURI' });

  // ID token already verified by API Gateway, just decode it
  const { 'cognito:username': userId } = JWT.decode(event.headers.Authorization.split(' ')[1]) as any;

  try {
    const avatarURI = await uploadAvatarToS3AndUpdateUserAttribute(userId, parsedDataUrl.toBuffer());
    return makeResponse(201, true, { avatarURI });
  } catch (e) {
    console.log('🚀  -> file: post-avatar.ts  -> line 111  -> e', JSON.stringify(e, null, 2));
    console.log('🚀  -> file: post-avatar.ts  -> line 111  -> e', e);
    return makeResponse(400, false, { error: e });
  }
};

export { postAvatarToken };
