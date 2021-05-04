import * as fs from 'fs';

import {
  writeParameters,
  getEnvironmentVariablesStringFromResponse,
} from './application-start-create-env-utils.js';

describe('environment variables retrieval from AWS parameter store', () => {
  test('should work for one variable', () => {
    const mock = { Parameters: [{ Value: '1', Name: '/PATH/TO/PARAMETER' }] };
    const environmentVariablesString = getEnvironmentVariablesStringFromResponse(mock);
    expect(environmentVariablesString).toBe('PARAMETER=1');
  });

  test('should work for multiple variables', () => {
    const mock = {
      Parameters: [
        { Value: '1', Name: '/PATH/TO/PARAMETER1' },
        { Value: '2', Name: '/PATH/TO/PARAMETER2' },
      ],
    };
    const environmentVariablesString = getEnvironmentVariablesStringFromResponse(mock);
    // ignore order of placement
    expect(['PARAMETER1=1\nPARAMETER2=2', 'PARAMETER2=2\nPARAMETER1=1']).toContain(
      environmentVariablesString,
    );
  });

  describe('file creation', () => {
    const testDirectory = 'test';

    test('should create file if GOOGLE_APPLICATION_CREDENTIALS is a parameter', async () => {
      const mock = {
        Parameters: [{ Value: '0', Name: '/PATH/TO/GOOGLE_APPLICATION_CREDENTIALS' }],
      };
      await writeParameters(testDirectory, mock);
      expect(fs.existsSync(`${testDirectory}/GOOGLE_APPLICATION_CREDENTIALS.json`)).toBe(true);
    });

    afterAll(() => {
      fs.rmdirSync(testDirectory, { recursive: true });
    });
  });
});
