import styled from 'styled-components';
import { Card, CardHeader, CardMedia, CardContent } from '@material-ui/core';

const StyledCard = styled(Card)`
  margin: ${({ theme }) => theme.spacing(1)}px;
  min-width: 250px;
  max-width: 250px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    min-width: 320px;
    max-width: 320px;
  }
  overflow: visible;
`;

const StyledCardHeader = styled(CardHeader)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledCardMedia = styled(CardMedia)`
  height: 120px;
  background-size: cover;
`;

const StyledCardContent = styled(CardContent)`
  height: 200px;
  overflow: scroll;
`;

export { StyledCard, StyledCardHeader, StyledCardMedia, StyledCardContent };
