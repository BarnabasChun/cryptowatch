export const toFixedAfterZero = (n, digitsAfterZero = 2) => {
  if (Number.isInteger(n)) return n;
  if (n === 3e-7) return 0;

  const [beforeDecimal, afterDecimal] = n.toString().split('.');

  const indexOfFirstNonZero = afterDecimal
    .split('')
    .map(parseFloat)
    .findIndex(x => x > 0);
  const slicedAfterDecimal = afterDecimal.slice(0, indexOfFirstNonZero + digitsAfterZero);
  return parseFloat(`${beforeDecimal}.${slicedAfterDecimal}`);
};

export const getNestedValues = o => {
  const isNestedObject = Object.keys(Object.values(o)).length === 1;

  if (isNestedObject) {
    return getNestedValues(Object.values(o)[0]);
  }

  return o;
};

export const formatMoney = n => {
  if (n < 1) return n;
  if (n <= 9999) return parseFloat(n.toFixed(2));
  if (n < 1000000) return `${(n / 1000).toFixed(2)}K`;
  if (n < 10000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n < 1000000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n < 1000000000000) return `${(n / 1000000000).toFixed(2)}B`;
  return '1T+';
};

export const getChangeColour = n => {
  const normalizedN = parseFloat(n);

  let changeColour;
  if (normalizedN === 0) {
    changeColour = 'black';
  } else if (normalizedN > 0) {
    changeColour = 'green';
  } else {
    changeColour = 'red';
  }
  return changeColour;
};

export const formatTradeInfo = obj =>
  Object.entries(obj).reduce((o, [key, value]) => {
    const changeSymbol = key.toLowerCase().includes('change') && value > 0 ? '+' : '';
    return {
      ...o,
      [key]:
        typeof value === 'number' && key !== 'LASTUPDATE'
          ? `${changeSymbol}${formatMoney(toFixedAfterZero(value))}`
          : value,
    };
  }, {});

export const removeParenthesis = str => str.replace(/[()]/g, '');
