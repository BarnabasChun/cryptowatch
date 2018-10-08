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
    watchlist: [],
  };

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
          watchlist.some(data =>
            getLastChar(data[columnToSort])
              .toUpperCase()
              .includes(symbol)
          )
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
