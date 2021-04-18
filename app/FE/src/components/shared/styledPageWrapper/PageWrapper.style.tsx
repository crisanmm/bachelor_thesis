import styled from 'styled-components';

const StyledPageWrapper = styled.div`
  ${({ theme }) => `
    margin: 0 auto;
    padding: ${theme.spacing(4)}px 0;
    
    ${theme.breakpoints.up('sm')} {
      padding: ${theme.spacing(6)}px 0;
      max-width ${theme.breakpoints.values.sm}px;
    }
    
    ${theme.breakpoints.up('md')} {
      padding: ${theme.spacing(8)}px 0;
      max-width ${theme.breakpoints.values.md}px;
    }
  `}
`;

export default StyledPageWrapper;
