import { makeResponse, validateTranslation, loadEnvironmentVariables } from '../shared';
import { v2 } from '@google-cloud/translate';

loadEnvironmentVariables();

const translateClient = new v2.Translate({ projectId: process.env.GOOGLE_PROJECT_ID });

/**
 * Get list of supported languages.
 * @param targetLanguage Optional argument.
 *         Get the list with the language names in a target language, the default is English.
 * @returns Array of supported languages
 */
const googleGetLanguages = async (targetLanguage?: string) => {
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

const getLanguages = async (event: any) => {
  console.log(event);

  try {
    const languages = await googleGetLanguages(event?.queryStringParameters?.targetLanguage);

    return makeResponse(200, true, { data: { languages } });
  } catch (e) {
    console.log('🚀  -> file: post-translate.ts  -> line 63  -> e', e);
  }
};

export { getLanguages };
