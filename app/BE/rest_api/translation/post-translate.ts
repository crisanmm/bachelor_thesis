import { v2 } from '@google-cloud/translate';
import { makeResponse, validateTranslation, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();

const translateClient = new v2.Translate({ projectId: process.env.GOOGLE_PROJECT_ID });

/**
 * Translate given text from one language to another.
 * @param text Text to be translated.
 * @param to ISO-639-1 language code representing language to translate to.
 * @param from Optional argument. ISO-639-1 language code representing the language of the text,
 *               can be detected from source text if undefined.
 * @returns Translated text.
 */
const googleTranslateText = async (text: string, to: string, from?: string) => {
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

const postTranslate = async (event: any) => {
  console.log(event);

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }

  let validatedTranslation;
  try {
    validatedTranslation = await validateTranslation(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.errors[0] });
  }

  try {
    const translatedText = await googleTranslateText(
      validatedTranslation.text,
      validatedTranslation.to,
      validatedTranslation.from,
    );

    return makeResponse(200, true, { data: { translatedText } });
  } catch (e) {
    console.log('🚀  -> file: post-translate.ts  -> line 63  -> e', e);
    return makeResponse(400, false, { error: e });
  }
};

export { postTranslate };
