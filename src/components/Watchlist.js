import React from 'react';
import styled from 'styled-components';
import Link from 'react-router-dom/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import { Wrapper } from './utils';

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

      let numberColour = 'black';
      if (header.numeric && header.prop.toLowerCase().includes('change')) {
        if (cellData > 0) {
          numberColour = 'green';
        } else {
          numberColour = 'red';
        }
      }

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
            color: numberColour,
          }}
        >
          {cellData}
        </TableCell>
      );
    })}
    <TableCell>
      <StyledDeleteIcon onClick={() => updateWatchList(data)} />
    </TableCell>
  </TableRow>
);

const DataTable = ({ data, headers, updateWatchList, ...props }) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          {headers.map(header => (
            <TableCell key={header.name} numeric={header.numeric}>
              {header.name}
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

const Watchlist = ({ watchlist, updateWatchList, ...props }) => (
  <StyledWatchList>
    <Wrapper>
      {watchlist.length ? (
        <StyledDataTable
          updateWatchList={updateWatchList}
          data={watchlist}
          headers={[
            {
              name: 'Name',
              numeric: false,
              prop: 'name',
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
        <Typography variant="display1">
          You are not following any coins. Search for one and add it to your watchlist.
        </Typography>
      )}
    </Wrapper>
  </StyledWatchList>
);

export default Watchlist;
