import { Children } from "react";
import { createGlobalStyle } from "styled-components";
import GlobalStyle from "./GlobalStyle";

const Layout = (props) => {
  return (
    <>
      <GlobalStyle />
      {props.children}
    </>
  );
};

export default Layout;
