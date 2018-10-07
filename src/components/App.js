import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Overview from './Overview';
import Watchlist from './Watchlist';

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
  };

  updateWatchList = coinDetails => {
    const indexToRemove = this.state.watchlist.findIndex(
      x => x.FROMSYMBOL === coinDetails.FROMSYMBOL
    );

    // remove from list if already present
    if (indexToRemove !== -1) {
      const updateWatchList = this.state.watchlist.filter((x, i) => i !== indexToRemove);

      this.setState({
        watchlist: updateWatchList,
      });
    } else {
      this.setState(({ watchlist }) => ({
        watchlist: [...watchlist, coinDetails],
      }));
    }
  };

  render() {
    const { currency, watchlist } = this.state;
    return (
      <div>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Watchlist
                  watchlist={watchlist}
                  updateWatchList={this.updateWatchList}
                  {...props}
                />
              )}
            />
            <Route
              path="/coins/:symbol/overview"
              render={props => (
                <Overview
                  currency={currency}
                  updateWatchList={this.updateWatchList}
                  watchlist={watchlist}
                  {...props}
                />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
