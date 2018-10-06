import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';

import { getTradeHistory, rangeOptions } from '../api';

const StockChart = ({ options, highcharts, ...props }) => (
  <HighchartsReact
    highcharts={highcharts}
    constructorType="stockChart"
    options={options}
    {...props}
  />
);

const getStockChartOptions = (tickerSymbol, data) => ({
  time: {
    useUTC: false,
  },
  series: [
    {
      data,
      name: `${tickerSymbol} Price`,
    },
  ],
  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'datetime',
    labels: {
      format: '{value:%Y-%b-%e}',
    },
  },
  rangeSelector: {
    enabled: false,
  },
  navigator: {
    enabled: false,
  },
});

const OptionButton = ({ isActive, option, updateSelected, ...props }) => (
  <Button
    color={isActive ? 'primary' : 'default'}
    onClick={() => updateSelected(option)}
    variant={isActive ? 'contained' : 'text'}
    {...props}
  >
    {option}
  </Button>
);

export default class CryptoChart extends Component {
  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
  };

  state = {
    range: '1D',
    historicalData: [],
  };

  componentDidMount() {
    const {
      match: {
        params: { symbol },
      },
    } = this.props;
    this.getHistoricalData(symbol);
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { symbol },
      },
    } = this.props;
    if (prevProps.match.params.symbol !== symbol) {
      this.getHistoricalData(symbol);
    }
  }

  getHistoricalData = async symbol => {
    const { currency } = this.props;
    const { range } = this.state;
    // the crypcompare api returns a data in UNIX time stamp
    // and Highcharts is expecting a javascript time which is UNIX time in milliseconds, so the time needs to be multipled by 1000
    const historicalData = (await getTradeHistory(symbol, currency, range)).Data.map(
      ({ time, close }) => [time * 1000, close]
    );

    this.setState({
      historicalData,
    });
  };

  updateRange = range => {
    const {
      match: {
        params: { symbol },
      },
    } = this.props;
    this.setState(
      {
        range,
      },
      () => this.getHistoricalData(symbol)
    );
  };

  render() {
    const {
      match: {
        params: { symbol },
      },
    } = this.props;
    const { historicalData, range } = this.state;
    if (!historicalData) return <div>Loading...</div>;
    return (
      <div>
        {rangeOptions.map(({ value }) => (
          <OptionButton
            key={value}
            option={value}
            isActive={value === range}
            updateSelected={this.updateRange}
          />
        ))}
        <StockChart
          options={getStockChartOptions(symbol, historicalData)}
          highcharts={Highcharts}
        />
      </div>
    );
  }
}
