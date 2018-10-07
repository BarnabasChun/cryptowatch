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
    watchlist: [
      {
        CHANGE24HOUR: -67.21,
        CHANGEDAY: -1.69,
        CHANGEPCT24HOUR: -0.73,
        CHANGEPCTDAY: -0.018,
        FLAGS: '2',
        FROMSYMBOL: 'BTC',
        HIGH24HOUR: 9176.92,
        HIGHDAY: 9216.97,
        LASTMARKET: 'QuadrigaCX',
        LASTTRADEID: '3670110',
        LASTUPDATE: 1538930954,
        LASTVOLUME: 0.24,
        LASTVOLUMETO: 2197.48,
        LOW24HOUR: 9072.69,
        LOWDAY: 8143.76,
        MARKET: 'CCCAGG',
        MKTCAP: 157552459839.18,
        OPEN24HOUR: 9169.1,
        OPENDAY: 9103.58,
        PRICE: 9101.89,
        SUPPLY: 17309862,
        TOSYMBOL: 'CAD',
        TOTALVOLUME24H: 146864.015,
        TOTALVOLUME24HTO: 1336724625.71,
        TYPE: '5',
        VOLUME24HOUR: 97.27,
        VOLUME24HOURTO: 869880.37,
        VOLUMEDAY: 57.7,
        VOLUMEDAYTO: 521054.5,
        name: 'Bitcoin (BTC)',
      },
    ],
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
