import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import CryptoSearchBox from './CryptoSearchBox';
import { Wrapper } from './utils';
import Logo from './Logo';

const NavWrapper = styled(Wrapper)`
  display: grid;
  grid-template-columns: max-content 1fr repeat(2, max-content);
  grid-gap: 60px;
`;

const navStyles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
});

const CurrencySelect = ({ currency, onChange }) => (
  <Select variant="filled" value={currency} onChange={onChange} name="currency">
    {['USD', 'CAD', 'EUR'].map(x => (
      <MenuItem key={x} value={x}>
        {x}
      </MenuItem>
    ))}
  </Select>
);

const Nav = ({ classes, isLoggedIn, currency, onChange }) => (
  <AppBar position="static" color="default">
    <Toolbar>
      <NavWrapper>
        <Logo />
        <CryptoSearchBox placeholder="Search for cryptocurrencies" classes={classes} />
        <CurrencySelect onChange={onChange} currency={currency} />
        <Button variant="flat">{isLoggedIn ? 'Sign Out' : 'Sign In'}</Button>
      </NavWrapper>
    </Toolbar>
  </AppBar>
);

export default withStyles(navStyles)(Nav);
