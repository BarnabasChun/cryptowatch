import React, { Component } from 'react';
import styled from 'styled-components';
import { Wrapper, ErrorText } from './utils';

const ErrorWrapper = styled(Wrapper)`
  padding: 60px 0;
`;

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <ErrorWrapper>
            <ErrorText variant="display2">Error</ErrorText>
            <ErrorText variant="subheading">
              Oh no, something went wrong! There was a problem retrieving the data you requested.
              Please try again later.
            </ErrorText>
          </ErrorWrapper>
        </div>
      );
    }
    return this.props.children;
  }
}
