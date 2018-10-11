import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CryptoSearchBox from './CryptoSearchBox';
import { Wrapper } from './utils';
import Logo from './Logo';

const NavWrapper = styled(Wrapper)``;

const Nav = () => (
  <AppBar position="static">
    <Toolbar>
      <NavWrapper>
        <Logo />
        <CryptoSearchBox placeholder="Search for cryptocurrencies" />
      </NavWrapper>
    </Toolbar>
  </AppBar>
);

export default Nav;
