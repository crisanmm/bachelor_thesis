const API_URL = 'https://api.think-in.me';
const API_STAGE = 'dev';

const S3_BUCKET_REGION = 'eu-central-1';
const S3_CHATS_BUCKET_NAME = 'think-in-chats';
const S3_STAGES_BUCKET_NAME = 'think-in-stages';

const ENDPOINTS = {
  API: `${API_URL}/${API_STAGE}`,
  USERS: `${API_URL}/${API_STAGE}/users`,
  STAGES: `${API_URL}/${API_STAGE}/stages`,
  AVATARS: `${API_URL}/${API_STAGE}/avatars`,
  TRANSLATION: `${API_URL}/${API_STAGE}/translation`,
  S3_CHATS_BUCKET: `https://${S3_CHATS_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com`,
  S3_STAGES_BUCKET: `https://${S3_STAGES_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com`,
};

export { ENDPOINTS, S3_CHATS_BUCKET_NAME, S3_STAGES_BUCKET_NAME };
