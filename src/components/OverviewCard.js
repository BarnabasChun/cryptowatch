import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import classNames from 'classnames';
import { getTradeInfo, getAllCoins } from '../api';
import { getSecondWord } from '../helpers';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
  },
  followButton: {
    justifySelf: 'end',
  },
  priceInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, max-content)',
    gridGap: '1rem',
  },
});

const FollowButton = ({ alreadyFollowing, classes, details, updateWatchList }) => (
  <Button
    variant="contained"
    color="secondary"
    className={classes.followButton}
    onClick={() => updateWatchList(alreadyFollowing ? 'REMOVE' : 'ADD', details)}
  >
    {alreadyFollowing ? (
      <CheckIcon className={classes.leftIcon} />
    ) : (
      <AddIcon className={classes.leftIcon} />
    )}
    {alreadyFollowing ? 'Following' : 'Follow'}
  </Button>
);

const CoinInfo = ({ classes, details }) => {
  const { name, PRICE, CHANGEDAY, CHANGEPCTDAY, LASTUPDATE } = details;
  const priceChange = getSecondWord(CHANGEDAY);
  let changeColour = 'black';
  if (priceChange > 0) {
    changeColour = 'green';
  } else {
    changeColour = 'red';
  }
  return (
    <div>
      <Typography component="h2" variant="title" gutterBottom>
        {name}
      </Typography>
      <div className={classes.priceInfo}>
        <Typography component="h2" variant="headline">
          {getSecondWord(PRICE)}
        </Typography>
        <Typography
          component="h2"
          variant="headline"
          style={{
            color: changeColour,
          }}
        >
          {priceChange} ({CHANGEPCTDAY}
          %)
        </Typography>
      </div>
      <Typography variant="subheading">Last updated: {LASTUPDATE}</Typography>
    </div>
  );
};

const OverviewCard = ({ details, classes, className, updateWatchList, watchlist }) => {
  if (Object.keys(details).length) {
    const alreadyFollowing = !!watchlist.find(coin => coin.FROMSYMBOL === details.FROMSYMBOL);
    return (
      <div className={classNames(classes.container, className)}>
        <CoinInfo classes={classes} details={details} />
        <FollowButton
          updateWatchList={updateWatchList}
          classes={classes}
          alreadyFollowing={alreadyFollowing}
          details={details}
        />
      </div>
    );
  }
  return null;
};

const OverviewCardWithStyles = withStyles(styles)(OverviewCard);

export default class OverviewCardContainer extends Component {
  state = {
    coinInfo: {},
  };

  componentDidMount() {
    const {
      match: {
        params: { symbol },
      },
    } = this.props;
    this.getCoinInfo(symbol);
    this.interval = setInterval(() => {
      this.getCoinInfo(symbol);
    }, 5000);
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { symbol },
      },
    } = this.props;
    if (prevProps.match.params.symbol !== symbol) {
      this.getCoinInfo(symbol);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCoinInfo = async symbol => {
    const { currency } = this.props;

    const updatedCoinInfo = Object.values(
      Object.values((await getTradeInfo(symbol, currency)).DISPLAY)[0]
    )[0];

    if (this.state.coinInfo.name) {
      // over-writes every property other than name
      this.setState(({ coinInfo }) => ({
        coinInfo: {
          ...coinInfo,
          updatedCoinInfo,
        },
      }));
    } else {
      // only make extra api call if necessary
      const { FullName } = (await getAllCoins()).Data[symbol];
      updatedCoinInfo.name = FullName;
      this.setState({
        coinInfo: updatedCoinInfo,
      });
    }
  };

  render() {
    const { coinInfo } = this.state;
    const { watchlist, updateWatchList, ...rest } = this.props;
    return (
      <OverviewCardWithStyles
        details={coinInfo}
        watchlist={watchlist}
        updateWatchList={updateWatchList}
        {...rest}
      />
    );
  }
}
