const getNthWord = n => s => s.split(' ')[n - 1];

export const getSecondWord = getNthWord(2);
