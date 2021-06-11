const API_URL = 'https://api.think-in.me';
const API_STAGE = 'dev';

const S3_CHATS_BUCKET_NAME = 'think-in-chats';
const S3_BUCKET_REGION = 'eu-central-1';

const ENDPOINTS = {
  API: `${API_URL}/${API_STAGE}`,
  USERS: `${API_URL}/${API_STAGE}/users`,
  TRANSLATION: `${API_URL}/${API_STAGE}/translation`,
  S3_CHATS_BUCKET: `https://${S3_CHATS_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com`,
};

export { ENDPOINTS, S3_CHATS_BUCKET_NAME, S3_BUCKET_REGION };
