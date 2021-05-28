import * as yup from 'yup';

const loadEnvironmentVariables = () => {
  process.env.DYNAMODB_TABLE_NAME = 'think-in-database';
  process.env.USER_POOL_ID = 'eu-central-1_pu83KKkCb';
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

  return schema.validate(notification, {
    stripUnknown: true,
    abortEarly: true,
  }) as Promise<UserAttributes>;
};

export { makeResponse, validateMessage, validateNotification, loadEnvironmentVariables };
export type { Message, TextMessageType, MediaMessageType, UserAttributes };

// (async () => {
//   const notification = {"id":"global","blabla": true,"givenName":"Global","familyName":"Chat","email":"global@think-in.me","emailVerified":true,"picture":"https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/global.jpg"}
//   const res = await validateNotification(notification);
//   console.log(res);
// })()
