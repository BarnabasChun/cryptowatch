import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Nav from './Nav';
import Watchlist from './Watchlist';
import Coins from './Coins';

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

  render() {
    const { currency, watchlist, isLoggedIn } = this.state;
    return (
      <div>
        <GlobalStyle />
        <Router>
          <>
            <Nav isLoggedIn={isLoggedIn} />
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
