import axios from 'axios';
import moment from 'moment';

const getCryptoCompareData = params =>
  axios(
    `https://min-api.cryptocompare.com/data/${params}${
      params.includes('?') ? '&' : '?'
    }extraParams=cryptowatch`
  )
    .then(res => res.data)
    .catch(err => console.log(err));

export const getTradeInfo = (symbols, currency) =>
  getCryptoCompareData(`pricemultifull?fsyms=${symbols}&tsyms=${currency}`);

export const getAllCoins = () => getCryptoCompareData('all/coinlist');

export const rangeOptions = [
  { value: '1D', aggregate: 5 },
  { value: '5D', aggregate: 30 },
  { value: '1M', aggregate: 1 },
  { value: '6M', aggregate: 1 },
  { value: 'YTD', aggregate: 1 },
  { value: '1Y', aggregate: 1 },
  { value: '5Y', aggregate: 7 },
  { value: 'Max', aggregate: 7 },
];

export const getTradeHistory = async (symbol, currency, range) => {
  const normalizedRange = range.toUpperCase();

  let totalCalendarUnits;
  // only for 1D, 5D, 1M, 6M, 1Y, 5Y (i.e. excludes YTD, MAX)
  const [unitAmount, calendarUnit] = normalizedRange.split('');

  const calendarUnitAmount = parseFloat(unitAmount);

  // only day ranges (i.e. 1D or 5D) use the histo[minute] endpoint, all others use histo[day]
  const lookupUnit = calendarUnit === 'D' ? 'minute' : 'day';

  const { aggregate } = rangeOptions.find(option => option.value === range);

  if (lookupUnit === 'minute') {
    // 1440 minutes / day
    const minutesPerDay = 60 * 24;
    totalCalendarUnits = minutesPerDay * calendarUnitAmount; // total number of MINUTES within range
  } else {
    let pastDate;
    const now = moment();
    if (calendarUnit === 'M') {
      // get the date x months ago
      pastDate = moment().subtract(calendarUnitAmount, 'months');
    } else if (calendarUnit === 'Y') {
      // get the date x years ago
      pastDate = moment().subtract(calendarUnitAmount, 'years');
    } else if (normalizedRange === 'YTD') {
      // get the start of the year
      pastDate = moment().startOf('year');
    } else if (normalizedRange === 'MAX') {
      const dateStartedTrading =
        (await getCryptoCompareData(
          `histoday?fsym=${symbol}&tsym=${currency}&aggregate=${aggregate}&limit=2000`
        )).Data[0].time * 1000;
      pastDate = moment(dateStartedTrading);
    }
    // total number of DAYS within range (between today and the past date)
    totalCalendarUnits = moment.duration(now.diff(pastDate)).asDays();
  }

  const limit = Math.round(totalCalendarUnits / aggregate);
  return getCryptoCompareData(
    `histo${lookupUnit}?fsym=${symbol}&tsym=${currency}&aggregate=${aggregate}&limit=${limit}`
  );
};
