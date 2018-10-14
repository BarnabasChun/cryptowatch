import React, { Component } from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { LoadingSpinnerWrapper } from './utils';

import { getTradeInfo, getAllCoins } from '../api';
import { getNestedValues, getChangeColour, formatTradeInfo } from '../helpers';

const StyledOverviewCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  @media only screen and (max-width: 500px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .follow-btn {
    justify-self: end;

    @media only screen and (max-width: 500px) {
      justify-self: start;
    }
  }
`;

const PriceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: 15px;
`;

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const FollowButton = ({ alreadyFollowing, classes, details, updateWatchList, className }) => (
  <Button
    variant="contained"
    color="secondary"
    className={className}
    onClick={() => updateWatchList({ symbol: details.FROMSYMBOL, alreadyFollowing })}
  >
    {alreadyFollowing ? (
      <CheckIcon className={classes.leftIcon} />
    ) : (
      <AddIcon className={classes.leftIcon} />
    )}
    {alreadyFollowing ? 'Following' : 'Follow'}
  </Button>
);

const CoinInfo = ({ details }) => {
  const { NAME, PRICE, CHANGEDAY, CHANGEPCTDAY, LASTUPDATE } = details;
  const changeColour = getChangeColour(CHANGEPCTDAY);
  return (
    <div>
      <Typography component="h2" variant="title" gutterBottom>
        {NAME}
      </Typography>
      <PriceInfo>
        <Typography component="h2" variant="headline">
          {PRICE}
        </Typography>
        <Typography
          component="h2"
          variant="headline"
          style={{
            color: changeColour,
          }}
        >
          {CHANGEDAY} ({CHANGEPCTDAY}
          %)
        </Typography>
      </PriceInfo>
      <Typography variant="subheading">
        Last updated: {moment(LASTUPDATE * 1000).fromNow()}
      </Typography>
    </div>
  );
};

const OverviewCard = ({ details, classes, className, updateWatchList, watchlist }) => {
  if (Object.keys(details).length) {
    const alreadyFollowing =
      watchlist && !!Object.keys(watchlist).find(symbol => symbol === details.FROMSYMBOL);
    return (
      <StyledOverviewCard className={classNames(classes.container, className)}>
        <CoinInfo classes={classes} details={details} />
        <FollowButton
          className="follow-btn"
          updateWatchList={updateWatchList}
          classes={classes}
          alreadyFollowing={alreadyFollowing}
          details={details}
        />
      </StyledOverviewCard>
    );
  }
  return null;
};

const OverviewCardWithStyles = withStyles(styles)(OverviewCard);

export default class OverviewCardContainer extends Component {
  state = {
    coinInfo: {},
    isLoading: true,
  };

  componentDidMount() {
    const {
      match: {
        params: { symbol },
      },
      currency,
    } = this.props;
    this.getCoinInfo(currency, symbol);
    this.interval = setInterval(() => {
      this.getCoinInfo(currency, symbol);
    }, 5000);
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { symbol },
      },
      currency,
    } = this.props;
    if (prevProps.match.params.symbol !== symbol || prevProps.currency !== currency) {
      clearInterval(this.interval);
      this.getCoinInfo(currency, symbol);
      this.interval = setInterval(() => {
        this.getCoinInfo(currency, symbol);
      }, 5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCoinInfo = async (currency, symbol) => {
    try {
      const updatedCoinInfo = formatTradeInfo(
        getNestedValues((await getTradeInfo(symbol, currency)).RAW)
      );

      if (this.state.coinInfo.name) {
        // over-writes every property other than name
        this.setState(({ coinInfo }) => ({
          coinInfo: {
            ...coinInfo,
            ...updatedCoinInfo,
          },
        }));
      } else {
        // only make extra api call if necessary
        const { FullName } = (await getAllCoins()).Data[symbol];
        updatedCoinInfo.NAME = FullName;
        this.setState({
          coinInfo: updatedCoinInfo,
          isLoading: false,
        });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    const { coinInfo, isLoading } = this.state;
    const { watchlist, updateWatchList, ...rest } = this.props;
    return isLoading ? (
      <LoadingSpinnerWrapper height={100} marginBottom={20}>
        <CircularProgress />
      </LoadingSpinnerWrapper>
    ) : (
      <OverviewCardWithStyles
        details={coinInfo}
        watchlist={watchlist}
        updateWatchList={updateWatchList}
        {...rest}
      />
    );
  }
}
