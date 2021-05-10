import { Toolbar, Button, AppBar } from '@material-ui/core';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
  display: block;
  ${({ theme }) => `
    background-color: ${theme.palette.background.paper};
    color: ${theme.palette.primary.main};
    box-shadow: unset;
  `}
`;

const StyledToolbar = styled(Toolbar)`
  ${({ theme }) => `
    margin: 0 auto;

    ${theme.breakpoints.up('sm')} {
      max-width: ${theme.breakpoints.values.sm}px;
    }

    ${theme.breakpoints.up('md')} {
      max-width: ${theme.breakpoints.values.md}px;
    }
`}
`;

/**
 * Used to insert whitespace between the elements in the left side of the header
 * and the right side of the header.
 */
const StyledFiller = styled.div`
  flex-grow: 1;
`;

const StyledSignInButton = styled(Button)``;

const StyledDivider = styled.div`
  border: none;
  height: 1px;
  margin: 0;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.palette.divider};
`;

export { StyledAppBar, StyledToolbar, StyledFiller, StyledSignInButton, StyledDivider };
