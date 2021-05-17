import Color from 'color';
import { deepPurple, red } from '@material-ui/core/colors';

const lightPalette = {
  primary: {
    main: deepPurple[500],
  },
  secondary: red,
  type: 'light',
};

const darkPalette = {
  primary: {
    main: Color(deepPurple[500]).lighten(0.15).hex(),
  },
  secondary: red,
  type: 'dark',
};

export { lightPalette, darkPalette };
