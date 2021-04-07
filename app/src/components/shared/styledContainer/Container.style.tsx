import { Container, ContainerProps } from '@material-ui/core';
import styled, { DefaultTheme } from 'styled-components';

const StyledContainer = styled((props: ContainerProps) => <Container {...props} />)`
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing(2)}px 0px;
  text-align: center;
  & > * {
    margin: 0 auto;
  }
`;

export default StyledContainer;
