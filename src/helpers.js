const getNthWord = n => s => s.split(' ')[n - 1];

export const getSecondWord = getNthWord(2);

export const getNestedValues = o => {
  const isNestedObject = Object.keys(Object.values(o)).length === 1;

  if (isNestedObject) {
    return getNestedValues(Object.values(o)[0]);
  }

  return o;
};
