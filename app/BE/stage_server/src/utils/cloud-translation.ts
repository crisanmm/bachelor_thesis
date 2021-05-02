import { v2 } from '@google-cloud/translate';

const translateClient = new v2.Translate({ projectId: process.env.GOOGLE_PROJECT_ID });

/**
 * Translate given text from one language to another.
 * @param text Text to be translated.
 * @param to Language to translate to.
 * @param from Optional argument. Original language of the text,
 *               can be detected from source text if undefined.
 * @returns Translated text.
 */
const translateText = async (text: string, to: string, from?: string) => {
  /**
   * Response example for
   * text = 'mama are mere'
   * to = 'en'
   * from = 'ro'
   * [
   *   "mom has apples",
   *   {
   *     "data": {
   *       "translations": [
   *         {
   *           "translatedText": "mom has apples"
   *         }
   *       ]
   *     }
   *   }
   * ]
   */
  const [, response] = await translateClient.translate(text, { from, to });
  return response.data.translations[0].translatedText;
};

/**
 * Get list of supported languages.
 * @param targetLanguage Optional argument.
 *         Get the list with the language names in a target language, the default is English.
 * @returns Array of supported languages
 */
const getLanguages = async (targetLanguage?: string) => {
  /**
   * Example of an object inside the returned array:
   * {
   *  language: "ro",  // ISO-639-1 language code
   *  name: "Romanian" // Language name
   * }
   *
   */
  const [languages] = await translateClient.getLanguages(targetLanguage);
  return languages;
};

export { translateText, getLanguages };
