import * as yup from 'yup';
import * as path from 'path';
import JWT from 'jsonwebtoken';
import sharp from 'sharp';
import { CognitoIdentityServiceProvider, S3 } from 'aws-sdk';

const s3 = new S3();
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const loadEnvironmentVariables = () => {
  process.env.DYNAMODB_TABLE_NAME = 'think-in-database';
  process.env.USER_POOL_ID = 'eu-central-1_pu83KKkCb';
  process.env.GOOGLE_PROJECT_ID = 'think-in-312413';
  process.env.S3_CHATS_BUCKET = 'think-in-chats';
  process.env.S3_STAGES_BUCKET = 'think-in-stages';
  process.env.COGNITO_USER_POOL_ID = 'eu-central-1_pu83KKkCb';

  const GOOGLE_APPLICATION_CREDENTIALS_PATH = path.resolve(
    __dirname,
    'translation',
    'GOOGLE_APPLICATION_CREDENTIALS.json',
  );
  process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_APPLICATION_CREDENTIALS_PATH;
};

const getLastEvaluatedKey = (event: any) => {
  let lastEvaluatedPK, lastEvaluatedSK;
  if (event.queryStringParameters?.lastEvaluatedPK || event.queryStringParameters?.lastEvaluatedSK) {
    if (!event.queryStringParameters?.lastEvaluatedPK)
      throw new Error('No lastEvalutedPK found as query parameter despite finding lastEvaluatedSK.');
    lastEvaluatedPK = event.queryStringParameters.lastEvaluatedPK;

    if (!event.queryStringParameters?.lastEvaluatedSK)
      throw new Error('No lastEvalutedSK found as query parameter despite finding lastEvaluatedPK.');
    lastEvaluatedSK = event.queryStringParameters.lastEvaluatedSK;
  }

  return [lastEvaluatedPK, lastEvaluatedSK];
};

interface MakeResponse {
  (statusCode: number, success: boolean, body: object): object;
}

/**
 * Convenience function for creating a response.
 * @param statusCode HTTP status code.
 * @param body Response body object
 * @param success Boolean value indicating response success
 * @returns AWS Lambda HTTP event response
 */
const makeResponse: MakeResponse = (statusCode, success, body) => {
  return {
    statusCode: String(statusCode),
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success, ...body }),
  };
};

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
  customLanguage?: string;
}

type UserInformationType = {
  id: string;
  name: string;
  picture: string;
};

interface BaseMessage {
  userInformation: UserInformationType;
  type: 'text/plain' | 'image/jpeg'; // MIME type of messages
  data: string;
  time: number;
}

interface TextMessageType extends BaseMessage {
  // ISO-639-1 language code
  language: string;
}

interface MediaMessageType extends BaseMessage {
  // alternative text description of the media
  alt: string;
}

type Message = TextMessageType | MediaMessageType;

interface ValidateMessage {
  (message: any): Promise<Message>;
}

const validateMessage: ValidateMessage = (message) => {
  const schema = yup.object().shape({
    userInformation: yup.object().shape({
      id: yup.string().required('userInformation.id required'),
      name: yup.string().required('userInformation.name required'),
      picture: yup.string().url().required('userInformation.picture required'),
    }),
    time: yup.number().required('timestamp required'),
    type: yup
      .string()
      .matches(/(text\/plain)|(image\/\w+)/)
      .required('type required'),
    data: yup.string().required('data required'),
    language: yup.string(),
    alt: yup.string(),
  });

  return schema.validate(message, { stripUnknown: true, abortEarly: true }) as Promise<Message>;
};

interface ValidateNotification {
  (notification: any): Promise<UserAttributes>;
}

const validateNotification: ValidateNotification = (notification) => {
  const schema = yup.object().shape({
    picture: yup.string().url().required('notification user picture required'),
    id: yup.string().required('notification user id required'),
    email: yup.string().email().required('notification user email required'),
    emailVerified: yup.bool(),
    givenName: yup.string().required('user given name required'),
    familyName: yup.string().required('user family name required'),
    customFacebook: yup.string(),
    customLinkedin: yup.string(),
    customPhone: yup.string(),
    customJob: yup.string(),
  });

  return schema.validate(notification, { stripUnknown: true, abortEarly: true }) as Promise<UserAttributes>;
};

interface Translation {
  text: string;
  to: string; // ISO-639-1 language code
  from?: string; // ISO-639-1 language code
}

interface ValidateTranslation {
  (translation: any): Promise<Translation>;
}

const validateTranslation: ValidateTranslation = (translation) => {
  const schema = yup.object().shape({
    text: yup.string().required('text property representing text to be translated is required'),
    to: yup.string().required('to property language code representing language to translate text to is required'),
    from: yup.string(),
  });

  return schema.validate(translation, { stripUnknown: true, abortEarly: true }) as Promise<Translation>;
};

interface Stage {
  title: string;
  subheader: string;
  externalLink: string;
  imageLink: string;
  videoLink: string;
  body: string;
}

interface ValidateStage {
  (stage: any): Promise<Stage>;
}

const validateStage: ValidateStage = (stage) => {
  const schema = yup.object().shape({
    title: yup.string().required('stage title required'),
    subheader: yup.string().required('stage subheader required'),
    externalLink: yup.string().url('stage external link must be a valid url').required('stage external link required'),
    imageLink: yup.string().url('stage image link must be a valid url').required('stage image link required'),
    videoLink: yup.string().url('stage video link must be a valid url').required('stage video link required'),
    body: yup.string().required('stage body required'),
  });

  return schema.validate(stage, { stripUnknown: true, abortEarly: true }) as Promise<Stage>;
};

interface UploadAvatarToS3AndUpdateUserAttribute {
  (userId: string, avatarBuffer: Buffer): Promise<string>;
}

/**
 * Processes and uploads an avatar to S3.
 * @param userId Cognito uuid v4 ID of the user
 * @param avatarBuffer Buffer that contains the avatar image
 * @returns URI to the avatar resource hosted on S3
 */
const uploadAvatarToS3AndUpdateUserAttribute: UploadAvatarToS3AndUpdateUserAttribute = async (userId, avatarBuffer) => {
  const processedAvatar = await sharp(avatarBuffer).resize(256, 256).jpeg().toBuffer();

  const { Location: avatarURI } = await s3
    .upload({
      Bucket: process.env.S3_CHATS_BUCKET!,
      Key: `avatars/${userId}.jpg`,
      Body: processedAvatar,
      ContentType: 'image/jpeg',
    })
    .promise();

  await cognitoIdentityServiceProvider
    .adminUpdateUserAttributes({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: userId,
      UserAttributes: [{ Name: 'picture', Value: avatarURI }],
    })
    .promise();

  return avatarURI;
};

interface ValidateAdminGroup {
  (token: string): boolean;
}

/**
 * Validates whether a user belongs to the admin group or not.
 * @param token JSON Web Token which contains claims about a user
 * @returns True if the user belongs to the admin group, false otherwise.
 */
const validateAdminGroup: ValidateAdminGroup = (token) => {
  // ID token already verified by API Gateway, just decode it
  const { 'cognito:groups': cognitoGroups } = JWT.decode(token) as any;
  if ((cognitoGroups as string[] | undefined)?.includes('admin')) return true;
  return false;
};

export {
  s3,
  cognitoIdentityServiceProvider,
  getLastEvaluatedKey,
  makeResponse,
  validateMessage,
  validateNotification,
  validateTranslation,
  validateStage,
  loadEnvironmentVariables,
  uploadAvatarToS3AndUpdateUserAttribute,
  validateAdminGroup
};
export type { Message, TextMessageType, MediaMessageType, Stage, UserAttributes };

// (async () => {
//   const notification = {"id":"global","blabla": true,"givenName":"Global","familyName":"Chat","email":"global@think-in.me","emailVerified":true,"picture":"https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/global.jpg"}
//   const res = await validateNotification(notification);
//   console.log(res);
// })()
