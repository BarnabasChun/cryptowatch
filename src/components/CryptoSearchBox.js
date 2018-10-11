import React, { Component } from 'react';
import withRouter from 'react-router-dom/withRouter';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import last from 'lodash/last';
import { getAllCoins } from '../api';
import { removeParenthesis } from '../helpers';

const SearchInput = ({ classes, inputProps, placeholder }) => (
  <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <Input
      {...inputProps({
        placeholder,
      })}
      disableUnderline
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
    />
  </div>
);

const SearchSuggestions = ({
  suggestion: { Id, FullName },
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) => {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(FullName) > -1;
  // const isSelected = selectedItem === FullName;

  return (
    <MenuItem
      {...itemProps({
        item: FullName,
        key: Id,
        selected: isHighlighted,
        component: 'div',
        style: {
          fontWeight: isSelected ? 500 : 400,
        },
      })}
    >
      {FullName}
    </MenuItem>
  );
};

const CryptoSearchBox = ({ classes, onChange, selectedCoin, coins, placeholder }) => (
  <Downshift onChange={onChange} defaultHighlightedIndex={0} defaultSelectedItem={selectedCoin}>
    {({
      getInputProps, // Props to pass to the input
      getItemProps, // Props to pass into each of the suggested items
      isOpen, // Whether the "suggestions box" is visible or not
      inputValue, // Value that the user typed in the search box
      selectedItem, // Item that is currently selected in the list (when hovering)
      highlightedIndex, // Index of the item currently selected in the list
    }) => {
      const filteredItems = matchSorter(coins, inputValue, {
        keys: ['Name', 'CoinName'],
        maxRanking: matchSorter.rankings.WORD_STARTS_WITH,
      }).slice(0, 5);
      return (
        <div>
          <SearchInput inputProps={getInputProps} placeholder={placeholder} classes={classes} />
          {isOpen &&
            !!inputValue.length &&
            !!filteredItems.length && (
              <div>
                {filteredItems.map((item, index) => (
                  <SearchSuggestions
                    key={item.Id}
                    suggestion={item}
                    itemProps={getItemProps}
                    highlightedIndex={highlightedIndex}
                    selectedItem={selectedItem}
                    index={index}
                  />
                ))}
              </div>
            )}
        </div>
      );
    }}
  </Downshift>
);

class CryptoSearchBoxContainer extends Component {
  state = {
    coins: [],
    selectedCoin: '',
  };

  async componentDidMount() {
    const coins = Object.values((await getAllCoins()).Data);

    this.setState({
      coins,
    });
  }

  handleChange = selectedCoin => {
    this.setState(
      {
        selectedCoin,
      },
      () => {
        const lookupSymbol = removeParenthesis(last(selectedCoin.split(' ')));
        this.props.history.push(`/coins/${lookupSymbol}`);
      }
    );
  };

  render() {
    const { placeholder, classes } = this.props;
    const { coins, selectedCoin } = this.state;
    if (coins) {
      return (
        <CryptoSearchBox
          classes={classes}
          coins={coins}
          selectedCoin={selectedCoin}
          onChange={this.handleChange}
          placeholder={placeholder}
        />
      );
    }
    return null;
  }
}

export default withRouter(CryptoSearchBoxContainer);
