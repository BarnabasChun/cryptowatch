import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
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
  };

  componentDidMount() {
    this.setState({
      watchlist: ['BTC', 'ZRX', 'DOGE', 'ETH', 'IOT', 'NEO', 'DASH'],
    });
  }

  updateWatchList = coinName => {
    const indexToRemove = this.state.watchlist.findIndex(x => x === coinName);

    // remove from list if already present
    if (indexToRemove !== -1) {
      const updatedWatchList = this.state.watchlist.filter((x, i) => i !== indexToRemove);

      this.setState({
        watchlist: updatedWatchList,
      });
    } else {
      this.setState(({ watchlist }) => ({
        watchlist: [...watchlist, coinName],
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
        </Router>
      </div>
    );
  }
}
