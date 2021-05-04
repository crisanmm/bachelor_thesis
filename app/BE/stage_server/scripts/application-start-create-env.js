const path = require('path');
const { getParameterStore, writeParameters } = require('./application-start-create-env-utils');

(async () => {
  const response = await getParameterStore();
  const ROOT_DIR = path.resolve(__dirname, '..');
  await writeParameters(ROOT_DIR, response);
})();
