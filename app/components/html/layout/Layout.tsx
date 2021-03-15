import GlobalStyle from './GlobalStyle';

const Layout = ({ children }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);

export default Layout;
