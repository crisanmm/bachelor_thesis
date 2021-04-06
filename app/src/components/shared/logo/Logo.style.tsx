import styled from 'styled-components';
import Link from 'next/link';

interface LogoProps {
  /*
   "size" is a valid HTML attribute which would get passed down through styled-components
   to the underlying DOM node, use "_size" instead so the described situation doesn't happen
  */
  _size: number;
}

const Box = styled.div<LogoProps>`
  ${({ theme, _size }) => `
  position: relative;
  cursor: pointer;
  height: ${_size}px;
  width: ${_size}px;
  border-width: 4px;
  border-color: ${theme.palette.primary.main};
  border-style: solid;
  border-radius: 4px;
  padding: ${theme.spacing(3)}px;
  `}
`;

const Text = styled.span<LogoProps>`
  ${({ theme, _size }) => `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    color: ${theme.palette.primary.main};
    font-family: ${theme.typography.h1.fontFamily};
    font-size: ${_size / 4}px;
    letter-spacing: -1px;
`}
`;

const StyledLogo = ({ size = 60 }) => (
  <Link href="/">
    <Box _size={size}>
      <Text _size={size}>think-in</Text>
    </Box>
  </Link>
);

export default StyledLogo;
