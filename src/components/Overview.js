import React from 'react';
import { Wrapper } from './utils';
import OverviewCard from './OverviewCard';
import CryptoChart from './CryptoChart';

const Overview = ({ currency, ...props }) => (
  <Wrapper>
      <OverviewCard currency={currency} {...props} className="overview-card" />
      <CryptoChart currency={currency} {...props} />
  </Wrapper>
);

export default Overview;
