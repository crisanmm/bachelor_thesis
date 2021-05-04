/* eslint-disable max-len */
import * as path from 'path';
import { config } from 'dotenv';
import { translateText, getLanguages } from './cloud-translation';

config({ path: `${path.resolve(__dirname, '..', '..')}/.env` });

describe('text translation', () => {
  test('should translate "ada are mere" to "ada has apples" with auto source language detection', async () => {
    const translatedText = await translateText('ada are mere', 'en');
    expect(translatedText).toBe('ada has apples');
  });

  test('should translate "zoe are rosii" to "zoe has tomatoes" with specified language', async () => {
    const translatedText = await translateText('zoe are rosii', 'en', 'ro');
    expect(translatedText).toBe('zoe has tomatoes');
  });
});

describe('get languages', () => {
  test('should return "romanian" as "румынский" when target language is "ru"', async () => {
    const languages = await getLanguages('ru');
    const romanian = languages.find(({ code }) => code === 'ro');
    expect(romanian!.name).toBe('румынский');
  });

  test('should return "romanian" as "romanian" when no target language is given', async () => {
    const languages = await getLanguages();
    const romanian = languages.find(({ code }) => code === 'ro');
    expect(romanian!.name.toLowerCase()).toBe('romanian');
  });
});
