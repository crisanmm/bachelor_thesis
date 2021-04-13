import styled from 'styled-components';

const StyledPageWrapper = styled.div`
  ${({ theme }) => `
    margin: 0 auto;
    padding: 0 ${theme.spacing(2)}px;
    
    ${theme.breakpoints.up('sm')} {
      padding: 0 ${theme.spacing(3)}px;
      max-width ${theme.breakpoints.values.sm}px;
    }
    
    ${theme.breakpoints.up('md')} {
        max-width ${theme.breakpoints.values.md}px;
    }
  `}
`;

export default StyledPageWrapper;
