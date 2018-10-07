import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Overview from './Overview';

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

  updateWatchList = (updateType, coinDetails) => {
    if (updateType === 'ADD') {
      this.setState(({ watchlist }) => ({
        watchlist: [...watchlist, coinDetails],
      }));
    } else {
      const { watchlist } = this.state;
      const indexToRemove = watchlist.findIndex(x => x.FROMSYMBOL === coinDetails.FROMSYMBOL);

      const updatedWatchList = watchlist.filter((x, i) => i !== indexToRemove);

      this.setState({
        watchlist: updatedWatchList,
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
            <Route exact path="/" component={() => <div>Watchlist</div>} />
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
