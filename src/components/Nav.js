import React, { Component } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import 'firebase/auth';
import CryptoSearchBox from './CryptoSearchBox';
import Logo from './Logo';

const navBreakPoint1 = 650;
const navBreakPoint2 = 480;

const NavWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-gap: 10px;
  align-items: center;

  .search-icon {
    display: none;
    cursor: pointer;
  }

  @media only screen and (max-width: ${navBreakPoint1}px) {
    grid-template-columns: ${props => (props.isSearchBoxFullWidth ? '1fr' : 'repeat(2, 1fr)')};

    .search-icon {
      display: block;
    }

    .crypto-search-box {
      display: ${props => (props.isSearchBoxFullWidth ? 'flex' : 'none')};
      align-items: center;
    }

    .logo {
      display: ${props => (props.isSearchBoxFullWidth ? 'none' : 'block')};
      @media only screen and (max-width: ${navBreakPoint2}px) {
        display: block;
      }
    }
  }

  @media only screen and (max-width: ${navBreakPoint2}px) {
    grid-template-columns: 1fr;
    grid-gap: 5px;
    justify-items: center;
    padding: 10px 0;
  }
`;

const ActionsWrapper = styled.div`
  display: ${props => (props.isSearchBoxFullWidth ? 'none' : 'grid')};
  grid-template-columns: repeat(2, 1fr);
  justify-items: end;
  align-items: center;
  grid-gap: 10px;

  @media only screen and (max-width: ${navBreakPoint1}px) {
    grid-template-columns: repeat(2, 1fr) max-content;
  }

  @media only screen and (max-width: ${navBreakPoint2}px) {
    justify-items: start;
    grid-gap: 25px;
  }
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

class Nav extends Component {
  state = {
    isSearchBoxFullWidth: false,
    windowWidth: 0,
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  toggleFullSearchBox = () => {
    if (this.state.windowWidth <= navBreakPoint1) {
      this.setState(({ isSearchBoxFullWidth }) => ({
        isSearchBoxFullWidth: !isSearchBoxFullWidth,
      }));
    }
  };

  render() {
    const { classes, isLoggedIn, currency, onChange, openModal, logout } = this.props;
    const { isSearchBoxFullWidth } = this.state;
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <NavWrapper isSearchBoxFullWidth={isSearchBoxFullWidth}>
            <Logo className="logo" />
            <CryptoSearchBox
              placeholder="Search"
              className="crypto-search-box"
              classes={classes}
              toggleFullSearchBox={this.toggleFullSearchBox}
              isSearchBoxFullWidth={isSearchBoxFullWidth}
            />
            <ActionsWrapper isSearchBoxFullWidth={isSearchBoxFullWidth}>
              <SearchIcon className="search-icon" onClick={this.toggleFullSearchBox} />
              <CurrencySelect onChange={onChange} currency={currency} />
              <Button onClick={() => (isLoggedIn ? logout() : openModal())} variant="flat">
                {isLoggedIn ? 'Sign Out' : 'Sign In'}
              </Button>
            </ActionsWrapper>
          </NavWrapper>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(navStyles)(Nav);
