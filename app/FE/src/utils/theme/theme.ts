import { lightPalette, darkPalette } from './palette';

const baseTheme = {
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
  },
};

const lightTheme = {
  ...baseTheme,
  palette: lightPalette,
};

const darkTheme = {
  ...baseTheme,
  palette: darkPalette,
};

export { lightTheme, darkTheme };
