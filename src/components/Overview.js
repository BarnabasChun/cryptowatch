import React from 'react';
import styled from 'styled-components';
import { Wrapper } from './utils';
import OverviewCard from './OverviewCard';
import CryptoChart from './CryptoChart';

const StyledOverview = styled.div`
  padding: 40px 0;

  .overview-card {
    margin-bottom: 30px;
  }
`;

const Overview = ({ currency, ...props }) => (
  <StyledOverview>
    <Wrapper>
      <OverviewCard currency={currency} {...props} className="overview-card" />
      <CryptoChart currency={currency} {...props} />
    </Wrapper>
  </StyledOverview>
);

export default Overview;
