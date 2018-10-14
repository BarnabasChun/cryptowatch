import styled, { createGlobalStyle } from 'styled-components';
import Typography from '@material-ui/core/Typography';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, 
  *::after, 
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  a { text-decoration: none; }

  ul, li { list-style: none; }
`;

export const Wrapper = styled.div`
  max-width: 1170px;
  width: 90%;
  margin: 0 auto;
`;

export const ErrorText = styled(Typography)`
  &&& {
    color: red;
  }
`;

export default GlobalStyle;
