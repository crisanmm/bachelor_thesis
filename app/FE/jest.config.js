const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

const moduleNameMapped = pathsToModuleNameMapper(compilerOptions.paths, '');
// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of Object.entries(moduleNameMapped)) {
  moduleNameMapped[key] = `<rootDir>/${value}`;
}

module.exports = {
  // preset is optional, you don't need it in case you use babel preset typescript
  preset: 'ts-jest',
  // note this prefix option
  moduleNameMapper: moduleNameMapped,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};
