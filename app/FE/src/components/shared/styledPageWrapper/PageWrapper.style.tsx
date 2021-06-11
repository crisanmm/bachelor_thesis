import styled from 'styled-components';

const StyledPageWrapper = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(2)}px 0;
    
    ${theme.breakpoints.up('sm')} {
      padding: ${theme.spacing(4)}px;
    }
  `}
`;

export default StyledPageWrapper;
