import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import firebase from '../firebase';
import 'firebase/database';
import GlobalStyle from './utils';
import Nav from './Nav';
import Watchlist from './Watchlist';
import Coins from './Coins';
import LoginModal from './LoginModal';

export default class App extends Component {
  initialState = {
    currency: 'CAD',
    watchlist: null,
    isLoggedIn: false,
    loginModalIsOpen: false,
    displayLoginPrompt: false,
  };

  state = this.initialState;

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isLoggedIn: !!user });
      if (user) {
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`watchlist/${userId}`);
        dbRef.on('value', res => {
          const watchlist = res.val();

          this.setState({
            watchlist,
          });
        });
      }
    });
  }

  updateWatchList = ({ symbol, alreadyFollowing }) => {
    const { isLoggedIn, watchlist } = this.state;

    if (isLoggedIn) {
      const userId = firebase.auth().currentUser.uid;
      const watchlistRef = `watchlist/${userId}`;
      if (alreadyFollowing) {
        firebase
          .database()
          .ref(`${watchlistRef}/${symbol}`)
          .remove();
      } else {
        const watchlistTable = firebase.database().ref(watchlistRef);
        watchlistTable.set({
          ...watchlist,
          [symbol]: symbol,
        });
      }
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

  logout = () => {
    firebase.auth().signOut();
    this.setState(this.initialState);
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
              logout={this.logout}
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
