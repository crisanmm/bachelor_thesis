import { S3, CognitoIdentityServiceProvider } from 'aws-sdk';
import * as JWT from 'jsonwebtoken';
import parseDataUrl from 'parse-data-url';
import sharp from 'sharp';
import { makeResponse } from '../shared';

const USER_POOL_ID = 'eu-central-1_pu83KKkCb';

const s3 = new S3();
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

interface uploadAvatarToS3AndUpdateUserAttribute {
  (userId: string, avatarBuffer: Buffer): Promise<string>;
}

/**
 * Processes and uploads an avatar to S3.
 * @param userId Cognito uuid v4 ID of the user
 * @param avatarBuffer Buffer that contains the avatar image
 * @returns URI to the avatar resource hosted on S3
 */
const uploadAvatarToS3AndUpdateUserAttribute: uploadAvatarToS3AndUpdateUserAttribute = async (
  userId,
  avatarBuffer
) => {
  const processedAvatar = await sharp(avatarBuffer).resize(96, 96).jpeg().toBuffer();

  const { Location: avatarURI } = await s3
    .upload({
      Bucket: 'think-in-content',
      Key: `avatars/${userId}.jpg`,
      Body: processedAvatar,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    })
    .promise();

  await cognitoIdentityServiceProvider
    .adminUpdateUserAttributes({
      UserPoolId: USER_POOL_ID,
      Username: userId,
      UserAttributes: [{ Name: 'picture', Value: avatarURI }],
    })
    .promise();

  return avatarURI;
};

const postAvatar = async (event: any) => {
  console.log(event);

  const requestBody = JSON.parse(event.body);

  const parsedDataUrl = parseDataUrl(requestBody.avatarDataURI);
  if (!parsedDataUrl) return makeResponse(400, false, { error: 'Failed decoding avatarURI' });

  if (requestBody.userId) {
    // this branch is taken when avatar is uploaded at sign-up, before user is confirmed

    // make sure that user is not confirmed before uploading avatar
    let response;
    try {
      response = (
        await cognitoIdentityServiceProvider
          .adminGetUser({
            UserPoolId: USER_POOL_ID,
            Username: requestBody.userId,
          })
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
            parsedDataUrl.toBuffer()
          );
          return makeResponse(201, true, { avatarURI });

        default:
          return makeResponse(403, false, {
            error: 'Can upload avatar using only ID only when user is in UNCONFIRMED status.',
          });
      }
    }
  } else {
    // this branch is taken when avatar is uploaded after sign-up, after email is verified

    // ID token already validated by API Gateway, just decode it
    const { sub: userId } = JWT.decode(event.headers.Authorization.split(' ')[1]) as any;

    const avatarURI = await uploadAvatarToS3AndUpdateUserAttribute(
      userId,
      parsedDataUrl.toBuffer()
    );
    return makeResponse(201, true, { avatarURI });
  }
};

export { postAvatar };
