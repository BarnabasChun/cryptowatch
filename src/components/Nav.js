import React from 'react';
import styled from 'styled-components';
import CryptoSearchBox from './CryptoSearchBox';
import { Wrapper } from './utils';

const NavWrapper = styled(Wrapper)``;

const Nav = () => (
  <nav>
    <NavWrapper>
      <CryptoSearchBox />
    </NavWrapper>
  </nav>
);

export default Nav;
