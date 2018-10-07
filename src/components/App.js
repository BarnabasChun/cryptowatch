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
        CHANGE24HOUR: 'CAD 0.000090',
        CHANGEDAY: 'CAD 0.000090',
        CHANGEPCT24HOUR: '1.18',
        CHANGEPCTDAY: '1.18',
        FROMSYMBOL: 'DOGE',
        HIGH24HOUR: 'CAD 0.007718',
        HIGHDAY: 'CAD 0.007718',
        LASTMARKET: 'Exmo',
        LASTTRADEID: 0,
        LASTUPDATE: '1 min ago',
        LASTVOLUME: 'DOGE 0',
        LASTVOLUMETO: 'CAD 0',
        LOW24HOUR: 'CAD 0.007448',
        LOWDAY: 'CAD 0.007538',
        MARKET: 'CryptoCompare Index',
        MKTCAP: 'CAD 898.81 M',
        OPEN24HOUR: 'CAD 0.007628',
        OPENDAY: 'CAD 0.007628',
        PRICE: 'CAD 0.007718',
        SUPPLY: 'DOGE 116,460,621,100.8',
        TOSYMBOL: 'CAD',
        TOTALVOLUME24H: 'DOGE 757.56 M',
        TOTALVOLUME24HTO: 'CAD 5,846.66 K',
        VOLUME24HOUR: 'DOGE 0',
        VOLUME24HOURTO: 'CAD 0',
        VOLUMEDAY: 'DOGE 0',
        VOLUMEDAYTO: 'CAD 0',
        name: 'Dogecoin (DOGE)',
      },
    ],
  };

  updateWatchList = (updateType, coinDetails) => {
    if (updateType === 'ADD') {
      this.setState(({ watchlist }) => ({
        watchlist: [...watchlist, coinDetails],
      }));
    } else {
      const { watchlist } = this.state;
      const indexToRemove = watchlist.findIndex(x => x.FROMSYMBOL === coinDetails.FROMSYMBOL);

      const updateWatchList = watchlist.filter((x, i) => i !== indexToRemove);

      this.setState({
        watchlist: updateWatchList,
      });
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
