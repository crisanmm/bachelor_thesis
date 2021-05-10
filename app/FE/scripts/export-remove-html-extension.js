/**
 * When accessing pages in the application, Next.js changes
 * the address bar to match the name of the page, for example the sign-in page URI would look like:
 * https://think-in.me/sign-in
 *
 * The issue arises when you want to access this page by direct access you would get a 404, because
 * there is no "sign-in" resource cached by CloudFront, but "sign-in.html" instead.
 *
 * This script removes the ".html" suffix from the files, therefore accessing pages directly
 * shouldn't be any different than accessing the pages in the application.
 */

const fs = require('fs/promises');
const path = require('path');

(async () => {
  process.chdir(path.resolve(__dirname, '..', 'out'));
  const fileNames = await fs.readdir('.');
  const htmlFiles = fileNames.filter((fileName) => fileName.endsWith('.html'));

  await Promise.all(
    htmlFiles.map((htmlFile) => fs.rename(htmlFile, htmlFile.replace(/\.[^/.]+$/, ''))),
  );
})();
