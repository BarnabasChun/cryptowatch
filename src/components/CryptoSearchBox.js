import React, { Component } from 'react';
import { getAllCoins } from '../api';

const CryptoSearchBox = () => <div>Search</div>;

export default class CryptoSearchBoxContainer extends Component {
  state = {
    coins: [],
    selectedCoin: '',
  };

  async componentDidMount() {
    const coins = (await getAllCoins()).Data;
    this.setState({
      coins,
    });
  }

  render() {
    const { placeholder } = this.props;
    const { coins, selectedCoin } = this.state;
    return <CryptoSearchBox coins={coins} selectedCoin={selectedCoin} />;
  }
}
