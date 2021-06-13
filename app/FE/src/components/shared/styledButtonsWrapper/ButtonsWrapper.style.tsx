import styled from 'styled-components';

const StyledButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-top: ${({ theme }) => theme.spacing(0.5)}px;

  button {
    margin-top: ${({ theme }) => theme.spacing(0.5)}px;
    margin-bottom: ${({ theme }) => theme.spacing(0.5)}px;
  }
`;

export default StyledButtonsWrapper;
