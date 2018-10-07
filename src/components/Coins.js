import React from 'react';
import { Switch, Route } from 'react-router';
import Watchlist from './Watchlist';
import Overview from './Overview';

const Coins = ({ match: { path }, currency, watchlist, updateWatchList }) => (
  <Switch>
    <Route
      exact
      path={`${path}`}
      render={props => (
        <Watchlist watchlist={watchlist} updateWatchList={updateWatchList} {...props} />
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
        />
      )}
    />
  </Switch>
);

export default Coins;
