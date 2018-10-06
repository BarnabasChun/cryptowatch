import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Overview from './Overview';

const GlobalStyle = createGlobalStyle`
html {
  font-size: 62.5%;
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
  };

  render() {
    const { currency } = this.state;
    return (
      <div>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route exact path="/" component={() => <div>Watchlist</div>} />
            <Route
              path="/coins/:symbol/overview"
              component={props => <Overview currency={currency} {...props} />}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
