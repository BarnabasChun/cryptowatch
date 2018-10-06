import React from 'react';
import { Wrapper } from './utils';
import OverviewCard from './OverviewCard';

const Overview = ({ currency, ...props }) => (
  <Wrapper>
    <OverviewCard currency={currency} {...props} />
  </Wrapper>
);

export default Overview;
