import * as yup from 'yup';

const loadEnvironmentVariables = () => {
  process.env.DYNAMODB_TABLE_NAME = 'think-in-database';
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

type UserInformationType = {
  id: string;
  name: string;
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
      id: yup
        .string()
        .uuid('userInformation.id not an uuid')
        .required('userInformation.id required'),
      name: yup.string().required('userInformation.name required'),
    }),
    time: yup.number().required('timestamp required'),
    type: yup.string().oneOf(['text/plain', 'image/jpeg']).required('type required'),
    data: yup.string().required('data required'),
    language: yup.string(),
    alt: yup.string(),
  });

  return schema.validate(message, { stripUnknown: true, abortEarly: true }) as Promise<Message>;
};

export { makeResponse, validateMessage, loadEnvironmentVariables };
export type { Message, TextMessageType, MediaMessageType };
