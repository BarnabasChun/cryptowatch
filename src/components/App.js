import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import orderBy from 'lodash/orderBy';
import Watchlist from './Watchlist';
import Coins from './Coins';
import { getLastChar } from '../helpers';

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

const invertSortDirection = {
  desc: 'asc',
  asc: 'desc',
};

export default class App extends Component {
  state = {
    currency: 'CAD',
    columnToSort: '',
    sortDirection: 'desc',
    watchlist: [
      {
        CHANGE24HOUR: '-0.00018',
        CHANGEDAY: '-0.000092',
        CHANGEPCT24HOUR: '-2.32',
        CHANGEPCTDAY: '-1.17',
        FLAGS: '4',
        FROMSYMBOL: 'DOGE',
        HIGH24HOUR: '0.0079',
        HIGHDAY: '0.008',
        LASTMARKET: 'Exmo',
        LASTTRADEID: '0',
        LASTUPDATE: 1539017127,
        LASTVOLUME: '0',
        LASTVOLUMETO: '0',
        LOW24HOUR: '0.0076',
        LOWDAY: '0.0059',
        MARKET: 'CCCAGG',
        MKTCAP: '903.41M',
        OPEN24HOUR: '0.0079',
        OPENDAY: '0.0078',
        PRICE: '0.0077',
        SUPPLY: '116.47B',
        TOSYMBOL: 'CAD',
        TOTALVOLUME24H: '3.04B',
        TOTALVOLUME24HTO: '23.60M',
        TYPE: '5',
        VOLUME24HOUR: '0',
        NAME: 'Dogecoin (DOGE)',
      },
      {
        CHANGE24HOUR: '4.53',
        CHANGEDAY: '2.03',
        CHANGEPCT24HOUR: '1.44',
        CHANGEPCTDAY: '0.64',
        FLAGS: '4',
        FROMSYMBOL: 'ETH',
        HIGH24HOUR: '319.94',
        HIGHDAY: '319.38',
        LASTMARKET: 'Gemini',
        LASTTRADEID: '0',
        LASTUPDATE: 1539017230,
        LASTVOLUME: '0',
        LASTVOLUMETO: '0',
        LOW24HOUR: '313.65',
        LOWDAY: '314.67',
        MARKET: 'CCCAGG',
        MKTCAP: '32.65B',
        OPEN24HOUR: '314.2',
        OPENDAY: '316.7',
        PRICE: '318.74',
        SUPPLY: '102.45M',
        TOSYMBOL: 'CAD',
        TOTALVOLUME24H: '3.00M',
        TOTALVOLUME24HTO: '956.72M',
        TYPE: '5',
        VOLUME24HOUR: '298.39',
        VOLUME24HOURTO: '93.16K',
        VOLUMEDAY: '0',
        VOLUMEDAYTO: '0',
        NAME: 'Ethereum (ETH)',
      },
      {
        CHANGE24HOUR: '190.17',
        CHANGEDAY: '64.38',
        CHANGEPCT24HOUR: '2.1',
        CHANGEPCTDAY: '0.7',
        FLAGS: '1',
        FROMSYMBOL: 'BTC',
        HIGH24HOUR: '9371.66',
        HIGHDAY: '9375.37',
        LASTMARKET: 'LakeBTC',
        LASTTRADEID: '1539017274',
        LASTUPDATE: 1539017274,
        LASTVOLUME: '0.0058',
        LASTVOLUMETO: '54.55',
        LOW24HOUR: '9040.92',
        LOWDAY: '8560.62',
        MARKET: 'CCCAGG',
        MKTCAP: '160.12B',
        OPEN24HOUR: '9059.46',
        OPENDAY: '9185.24',
        PRICE: '9249.63',
        SUPPLY: '17.31M',
        TOSYMBOL: 'CAD',
        TOTALVOLUME24H: '218.30K',
        TOTALVOLUME24HTO: '2.02B',
        TYPE: '5',
        VOLUME24HOUR: '137.71',
        VOLUME24HOURTO: '1.26M',
        VOLUMEDAY: '119.43',
        VOLUMEDAYTO: '1.09M',
        NAME: 'Bitcoin (BTC)',
      },
    ],
  };

  updateWatchList = coinDetails => {
    const indexToRemove = this.state.watchlist.findIndex(
      x => x.FROMSYMBOL === coinDetails.FROMSYMBOL
    );

    // remove from list if already present
    if (indexToRemove !== -1) {
      const updatedWatchList = this.state.watchlist.filter((x, i) => i !== indexToRemove);

      this.setState({
        watchlist: updatedWatchList,
      });
    } else {
      this.setState(({ watchlist }) => ({
        watchlist: [...watchlist, coinDetails],
      }));
    }
  };

  handleSort = columnName => {
    // if the column has been sorted then invert its direction, otherwise sort in ascending order
    this.setState(
      ({ columnToSort, sortDirection }) => ({
        columnToSort: columnName,
        sortDirection: columnToSort === columnName ? invertSortDirection[sortDirection] : 'asc',
      }),
      () => {
        const { columnToSort, watchlist, sortDirection } = this.state;

        let tableData;

        const dataIncludesMoneySymbol = ['B', 'M', 'K'].some(symbol =>
          watchlist.some(data => getLastChar(data[columnToSort]).includes(symbol))
        );

        const dataIncludesPlusSign = watchlist.some(data =>
          data[columnToSort].charAt(0).includes('+')
        );

        if (dataIncludesMoneySymbol) {
          // ascending (greatest values last)
          tableData = watchlist.sort((a, b) => {
            const [moneySymbolOfA, moneySymbolOfB] = [a, b].map(x => getLastChar(x[columnToSort]));
            if (moneySymbolOfA === 'K' || (moneySymbolOfA === 'M' && moneySymbolOfB === 'B')) {
              return -1;
            }
            if ((moneySymbolOfA === 'B' && moneySymbolOfB === 'M') || moneySymbolOfB === 'K') {
              return 1;
            }
            return parseFloat(a[columnToSort]) > parseFloat(b[columnToSort]) ? 1 : -1;
          });
        } else if (dataIncludesPlusSign) {
          tableData = watchlist.sort(
            (a, b) => (parseFloat(a[columnToSort]) > parseFloat(b[columnToSort]) ? 1 : -1)
          );
        } else {
          tableData = orderBy(watchlist, columnToSort, sortDirection);
        }

        if ((dataIncludesMoneySymbol || dataIncludesPlusSign) && sortDirection === 'desc') {
          tableData = [...tableData.reverse()];
        }

        this.setState({
          watchlist: tableData,
        });
      }
    );
  };

  render() {
    const { currency, watchlist, columnToSort, sortDirection } = this.state;
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
                  handleSort={this.handleSort}
                  columnToSort={columnToSort}
                  sortDirection={sortDirection}
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
                  handleSort={this.handleSort}
                  columnToSort={columnToSort}
                  sortDirection={sortDirection}
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
