import axios from 'axios';
import { MessageType, TextMessageType } from '#components/index/chatManager/shared';
import { ENDPOINTS } from '#utils';

type TranslatedMessageType = MessageType & { translatedData: string };

interface TranslateMessage {
  (token: string, message: MessageType, toLanguage?: string): Promise<TranslatedMessageType | MessageType>;
}

const translateMessage: TranslateMessage = async (token, message, toLanguage) => {
  // if message is not a text message simply return
  if (message.type !== 'text/plain') return message as MessageType;

  // if toLanguage is undefined, don't translate message
  // (covers the case when user has no language set)
  // if (!toLanguage) return message as MessageType;

  // if from language === to language, don't translate message
  if (toLanguage === (message as TextMessageType).language) return message as MessageType;

  // translate text and return augmented message with translatedData string property
  try {
    const response = await axios.post(
      `${ENDPOINTS.TRANSLATION}/translate`,
      {
        text: message.data,
        to: toLanguage,
        from: (message as TextMessageType).language,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response.data.success) (message as TranslatedMessageType).translatedData = response.data.data.translatedText;
    return message as TranslatedMessageType;
  } catch (e) {
    return message as MessageType;
  }
};

export { translateMessage };
export type { TranslatedMessageType };
