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

const DataTableRow = ({ data, headers, updateWatchList, match: { url } }) => (
  <TableRow>
    {headers.map((header, j) => {
      const cellData = data[header.prop];

      const colour =
        header.numeric && header.prop.toLowerCase().includes('change') && getChangeColour(cellData);

      return j === 0 ? (
        <TableCell
          key={`${data.FROMSYMBOL}-${header.name}`}
          component="th"
          scope="row"
          numeric={header.numeric}
        >
          <StyledLink to={`${url}/${data.FROMSYMBOL}/overview`}>{cellData}</StyledLink>
        </TableCell>
      ) : (
        <TableCell
          key={`${data.FROMSYMBOL}-${header.name}`}
          numeric={header.numeric}
          style={{
            color: colour,
          }}
        >
          {cellData}
        </TableCell>
      );
    })}
    <TableCell>
      <StyledDeleteIcon onClick={() => updateWatchList(data.FROMSYMBOL)} />
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
          {headers.map(header => (
            <TableCell key={header.name} numeric={header.numeric}>
              <TableSortLabel
                active={columnToSort === header.prop}
                onClick={() => handleSort(header.prop)}
                direction={sortDirection}
              >
                {header.name}
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
  state = {
    rawData: [],
    formattedData: [],
    columnToSort: '',
    sortDirection: 'asc',
  };

  componentDidMount() {
    const { watchlist } = this.props;
    if (watchlist.length === 0) return;

    const symbols = watchlist.join(',');
    this.getCoinInfo(symbols);
    this.interval = setInterval(() => {
      this.getCoinInfo(symbols);
    }, 30000);
  }

  componentDidUpdate(prevProps) {
    const { watchlist } = this.props;
    if (prevProps.watchlist !== watchlist) {
      if (watchlist.length === 0) return;

      const symbols = watchlist.join(',');
      this.getCoinInfo(symbols);
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.getCoinInfo(symbols);
        }, 30000);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCoinInfo = async symbols => {
    const { currency } = this.props;
    const allCoins = (await getAllCoins()).Data;
    const rawData = Object.values((await getTradeInfo(symbols, currency)).RAW)
      .map(getNestedValues)
      .map(coinDetails => ({
        ...coinDetails,
        ...allCoins[coinDetails.FROMSYMBOL],
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
                  prop: 'FullName',
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
