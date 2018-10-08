import React from 'react';
import { Switch, Route } from 'react-router';
import Watchlist from './Watchlist';
import Overview from './Overview';

const Coins = ({
  match: { path },
  currency,
  watchlist,
  updateWatchList,
  handleSort,
  columnToSort,
  sortDirection,
  ...rest
}) => (
  <Switch>
    <Route
      exact
      path={`${path}`}
      render={props => (
        <Watchlist
          currency={currency}
          watchlist={watchlist}
          updateWatchList={updateWatchList}
          handleSort={handleSort}
          columnToSort={columnToSort}
          sortDirection={sortDirection}
          {...props}
          {...rest}
        />
      )}
    />
    <Route
      path={`${path}/:symbol`}
      render={props => (
        <Overview
          currency={currency}
          updateWatchList={updateWatchList}
          watchlist={watchlist}
          {...props}
          {...rest}
        />
      )}
    />
  </Switch>
);

export default Coins;
