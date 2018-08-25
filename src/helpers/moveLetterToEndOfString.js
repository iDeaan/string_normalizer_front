const moveLetterToEndOfString = (index, array) => {
  const movingItem = array[index];
  array.splice(index, 1);
  return [...array, movingItem];
};

export default moveLetterToEndOfString;
