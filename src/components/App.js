import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import firebase from '../firebase';
import GlobalStyle from './utils';
import Nav from './Nav';
import Watchlist from './Watchlist';
import Coins from './Coins';
import LoginModal from './LoginModal';

export default class App extends Component {
  state = {
    currency: 'CAD',
    watchlist: [],
    isLoggedIn: false,
    loginModalIsOpen: false,
    displayLoginPrompt: false,
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isLoggedIn: !!user }));
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  updateWatchList = coinName => {
    const { watchlist, isLoggedIn } = this.state;
    const indexToRemove = watchlist.indexOf(coinName);

    if (isLoggedIn) {
      // remove from list if already present
      this.setState(({ watchlist: oldWatchList }) => ({
        watchlist:
          indexToRemove !== -1
            ? oldWatchList.filter((x, i) => i !== indexToRemove)
            : [...oldWatchList, coinName],
      }));
    } else {
      this.promptUsertoLogin();
    }
  };

  promptUsertoLogin = () => {
    this.setState({
      loginModalIsOpen: true,
      displayLoginPrompt: true,
    });
  };

  handleChange = ({ target: { value, name } }) => {
    const { isLoggedIn } = this.state;
    if (name === 'currency' && !isLoggedIn) {
      this.promptUsertoLogin();
      return;
    }
    this.setState({
      [name]: value,
    });
  };

  toggleModal = () => {
    this.setState(({ loginModalIsOpen }) => ({
      loginModalIsOpen: !loginModalIsOpen,
    }));
  };

  render() {
    const { currency, watchlist, isLoggedIn, loginModalIsOpen, displayLoginPrompt } = this.state;
    return (
      <div>
        <GlobalStyle />
        <Router>
          <>
            <Nav
              isLoggedIn={isLoggedIn}
              currency={currency}
              onChange={this.handleChange}
              openModal={this.toggleModal}
            />
            <LoginModal
              isOpen={loginModalIsOpen}
              toggleModal={this.toggleModal}
              displayLoginPrompt={displayLoginPrompt}
            />
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Watchlist
                    currency={currency}
                    watchlist={watchlist}
                    updateWatchList={this.updateWatchList}
                    {...props}
                  />
                )}
              />
              <Route
                path="/coins"
                render={props => (
                  <Coins
                    currency={currency}
                    updateWatchList={this.updateWatchList}
                    watchlist={watchlist}
                    {...props}
                  />
                )}
              />
            </Switch>
          </>
        </Router>
      </div>
    );
  }
}
