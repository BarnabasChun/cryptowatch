export const displayNumbersAfterDecimal = (n, digitsAfterZero = 2) => {
  if (Number.isInteger(n)) return n;
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
