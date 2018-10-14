import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'react-router-dom/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import orderBy from 'lodash/orderBy';
import { Wrapper } from './utils';
import { getChangeColour, getNestedValues, formatTradeInfo } from '../helpers';
import { getTradeInfo, getAllCoins } from '../api';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const StyledDeleteIcon = styled(DeleteIcon)`
  cursor: pointer;
  color: grey;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: 600;
`;

const DataTableRow = ({ data, headers, updateWatchList }) => (
  <TableRow>
    {headers.map(({ prop, name, numeric }, j) => {
      const cellData = data[prop];

      const colour = numeric && prop.toLowerCase().includes('change') && getChangeColour(cellData);

      return j === 0 ? (
        <TableCell key={`${data.FROMSYMBOL}-${name}`} component="th" scope="row" numeric={numeric}>
          <StyledLink to={`/coins/${data.FROMSYMBOL}/overview`}>{cellData}</StyledLink>
        </TableCell>
      ) : (
        <TableCell
          key={`${data.FROMSYMBOL}-${name}`}
          numeric={numeric}
          style={{
            color: colour,
          }}
        >
          {cellData}
        </TableCell>
      );
    })}
    <TableCell>
      <StyledDeleteIcon
        onClick={() => updateWatchList({ symbol: data.FROMSYMBOL, alreadyFollowing: true })}
      />
    </TableCell>
  </TableRow>
);

const DataTable = ({
  data,
  headers,
  updateWatchList,
  handleSort,
  columnToSort,
  sortDirection,
  classes,
  ...props
}) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {headers.map(({ numeric, name, prop }) => (
            <TableCell key={name} numeric={numeric}>
              <TableSortLabel
                active={columnToSort === prop}
                onClick={() => handleSort(prop)}
                direction={sortDirection}
              >
                {name}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(dataPoint => (
          <DataTableRow
            updateWatchList={updateWatchList}
            key={dataPoint.FROMSYMBOL}
            data={dataPoint}
            headers={headers}
            {...props}
          />
        ))}
      </TableBody>
    </Table>
  </Paper>
);

const StyledDataTable = withStyles(styles)(DataTable);

const StyledWatchList = styled.div`
  padding: 60px 0;
`;

const invertSortDirection = {
  desc: 'asc',
  asc: 'desc',
};

export default class Watchlist extends Component {
  initialState = {
    rawData: [],
    formattedData: [],
    columnToSort: '',
    sortDirection: 'asc',
  };

  state = this.initialState;

  componentDidMount() {
    const { watchlist, currency } = this.props;
    if (watchlist === null) return;

    this.getCoinInfo(currency, watchlist);
    this.interval = setInterval(() => {
      this.getCoinInfo(currency, watchlist);
    }, 30000);
  }

  componentDidUpdate(prevProps) {
    const { watchlist, currency } = this.props;
    if (prevProps.watchlist !== watchlist || prevProps.currency !== currency) {
      if (watchlist === null) {
        this.setState(this.initialState);
        return;
      }

      this.getCoinInfo(currency, watchlist);
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.getCoinInfo(currency, watchlist);
        }, 30000);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCoinInfo = async (currency, watchlist) => {
    const symbols = Object.keys(watchlist);
    const allCoins = (await getAllCoins()).Data;
    const rawData = Object.values((await getTradeInfo(symbols, currency)).RAW)
      .map(getNestedValues)
      .map(coinDetails => ({
        ...coinDetails,
        NAME: allCoins[coinDetails.FROMSYMBOL].FullName,
      }));
    const formattedData = rawData.map(formatTradeInfo);

    this.setState({
      formattedData,
      rawData,
    });
  };

  handleSort = columnName => {
    this.setState(
      ({ columnToSort, sortDirection }) => ({
        columnToSort: columnName,
        sortDirection: columnToSort === columnName ? invertSortDirection[sortDirection] : 'asc',
      }),
      () => {
        const { rawData, columnToSort, sortDirection } = this.state;
        const sortedData = orderBy(rawData, columnToSort, sortDirection);
        const formattedSortedData = sortedData.map(formatTradeInfo);
        this.setState({
          formattedData: formattedSortedData,
        });
      }
    );
  };

  render() {
    const { updateWatchList, ...props } = this.props;
    const { formattedData, columnToSort, sortDirection } = this.state;
    return (
      <StyledWatchList>
        <Wrapper>
          <Typography variant="headline" style={{ marginBottom: '20px' }}>
            Your Watchlist
          </Typography>
          {formattedData.length ? (
            <StyledDataTable
              handleSort={this.handleSort}
              updateWatchList={updateWatchList}
              sortDirection={sortDirection}
              columnToSort={columnToSort}
              data={formattedData}
              headers={[
                {
                  name: 'Name',
                  numeric: false,
                  prop: 'NAME',
                },
                {
                  name: 'Price',
                  numeric: true,
                  prop: 'PRICE',
                },
                {
                  name: 'Change',
                  numeric: true,
                  prop: 'CHANGEDAY',
                },
                {
                  name: '% Change',
                  numeric: true,
                  prop: 'CHANGEPCTDAY',
                },
                {
                  name: 'Market Cap',
                  numeric: true,
                  prop: 'MKTCAP',
                },
                {
                  name: 'Circulating Supply',
                  numeric: true,
                  prop: 'SUPPLY',
                },
                {
                  name: 'Total Volume All Currencies (24Hr)',
                  numeric: true,
                  prop: 'TOTALVOLUME24HTO',
                },
              ]}
              {...props}
            />
          ) : (
            <Typography variant="body2">
              Your watchlist is empty. Search for cryptocurrencies to follow.
            </Typography>
          )}
        </Wrapper>
      </StyledWatchList>
    );
  }
}
