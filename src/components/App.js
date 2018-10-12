import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import firebase from 'firebase/app';
import GlobalStyle from './utils';
import Nav from './Nav';
import Watchlist from './Watchlist';
import Coins from './Coins';

const config = {
  apiKey: 'AIzaSyCsYU_HkObfPqy2ZYQURS_qmuuuw72j2oQ',
  authDomain: 'cryptowatch-975fc.firebaseapp.com',
  databaseURL: 'https://cryptowatch-975fc.firebaseio.com',
  projectId: 'cryptowatch-975fc',
  storageBucket: 'cryptowatch-975fc.appspot.com',
  messagingSenderId: '603280724069',
};

firebase.initializeApp(config);

export default class App extends Component {
  state = {
    currency: 'CAD',
    watchlist: [],
    isLoggedIn: false,
  };

  updateWatchList = coinName => {
    const { watchlist } = this.state;
    const indexToRemove = watchlist.indexOf(coinName);

    // remove from list if already present
    this.setState(({ watchlist: oldWatchList }) => ({
      watchlist:
        indexToRemove !== -1
          ? oldWatchList.filter((x, i) => i !== indexToRemove)
          : [...oldWatchList, coinName],
    }));
  };

  handleChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { currency, watchlist, isLoggedIn } = this.state;
    return (
      <div>
        <GlobalStyle />
        <Router>
          <>
            <Nav isLoggedIn={isLoggedIn} currency={currency} onChange={this.handleChange} />
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
