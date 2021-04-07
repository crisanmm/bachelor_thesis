import styled from 'styled-components';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@material-ui/core';
import Link, { LinkProps } from 'next/link';

/**
 * The {@link https://nextjs.org/docs/api-reference/next/link | next/link component}
 * with {@link https://material-ui.com/components/links/ | Material-UI link} as child component.
 */
const StyledLink = styled(({ href, ...props }: LinkProps & MuiLinkProps) => (
  <Link href={href} passHref>
    <MuiLink {...props} />
  </Link>
))`
  font-weight: bold;
`;

export default StyledLink;
