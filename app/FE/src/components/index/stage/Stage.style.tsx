import styled from 'styled-components';

const StyledCanvasWrapper = styled.div`
  max-width: 100%;
  height: 50vh;
  margin: ${({ theme }) => theme.spacing(4)}px auto;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: 75vh;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    max-width: 75%;
  }
`;

export default StyledCanvasWrapper;
