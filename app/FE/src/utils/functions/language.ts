/**
 * @returns ISO-639-1 language code
 */
const getUserLanguage = () => {
  if (window.navigator.language) return window.navigator.language;

  return 'en-US';
};

export { getUserLanguage };
