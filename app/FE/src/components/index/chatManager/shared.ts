interface BaseMessage {
  user: string;
  time: number;
  type: 'text' | 'media';
  // raw text message
  // or
  // link to media type
  data: string;
}

interface TextMessage extends BaseMessage {
  // ISO-639-1 language code
  language: string;
}

interface MediaMessage extends BaseMessage {
  // alternative text description of the media
  alt: string;
}

/**
 * Example messages:
 *
 * {
 *
 *  user: d3a1d2c1-03e3-452c-bf40-00eb5bf639e3,
 *
 *  time: 1619901459879
 *
 *  type: "text",
 *
 *  data: "this is a text message",
 *
 *  language: "en", // ISO-639-1 language code
 *
 * }
 *
 * {
 *
 *  user: d3a1d2c1-03e3-452c-bf40-00eb5bf639e3,
 *
 *  time: 1619901459879
 *
 *  type: "media",
 *
 *  data: "https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/avatar3.jpg",
 *
 *  alt: "Ana's avatar picture"
 *
 * }
 */
type Message = TextMessage | MediaMessage;

export type { Message, TextMessage, MediaMessage };
