const fs = require('fs');
const { exec } = require('child_process');

const PARAMETER_NAMES = [
  '/think-in/GOOGLE_PROJECT_ID',
  '/think-in/GOOGLE_APPLICATION_CREDENTIALS',
  '/think-in/WEBSOCKET_SERVER_PORT',
];

const getParameterStore = () =>
  new Promise((resolve, reject) => {
    exec(
      `aws ssm get-parameters --with-decryption --names \
      ${PARAMETER_NAMES.reduce((acc, name) => `${acc} ${name}`)}`,
      (err, stdout) => {
        if (err) reject(err);
        resolve(JSON.parse(stdout));
      },
    );
  });

const getEnvironmentVariablesStringFromResponse = (response) => {
  const env = {};
  response.Parameters.forEach((parameter) => {
    const splitParameterName = parameter.Name.split('/');
    env[splitParameterName[splitParameterName.length - 1]] = parameter.Value;
  });
  return Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .reduce((acc, value) => `${acc}\n${value}`);
};

const writeParameters = async (directory, response) => {
  fs.mkdirSync(directory, { recursive: true });
  /**
   * the GCP Service Account Key has to be put to a file
   * if the Service Account Key is found among the parameters, write it to a file
   * and replace the parameter's value with the path to the file
   */
  const GOOGLE_APPLICATION_CREDENTIALS = response.Parameters.find(
    (parameter) => parameter.Name.endsWith('GOOGLE_APPLICATION_CREDENTIALS') === true,
  );
  if (GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccountKeyPath = `${directory}/GOOGLE_APPLICATION_CREDENTIALS.json`;
    fs.writeFileSync(serviceAccountKeyPath, GOOGLE_APPLICATION_CREDENTIALS.Value);
    GOOGLE_APPLICATION_CREDENTIALS.Value = serviceAccountKeyPath;
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${directory}/.env`,
      getEnvironmentVariablesStringFromResponse(response),
      (err) => {
        if (err) reject(err);
        resolve();
      },
    );
  });
};

module.exports = { getParameterStore, writeParameters, getEnvironmentVariablesStringFromResponse };
