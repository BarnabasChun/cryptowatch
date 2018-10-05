import axios from 'axios';

const getCryptoCompareData = params =>
  axios(
    `https://min-api.cryptocompare.com/data/${params}${
      params.includes('?') ? '&' : '?'
    }extraParams=cryptowatch`
  )
    .then(res => res.data)
    .catch(err => console.log(err));
