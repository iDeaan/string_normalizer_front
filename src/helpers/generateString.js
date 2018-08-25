const generateString = (availableItems, stringLength) => {
  const stringLengthToGenereate = stringLength || Math.floor(Math.random() * 20) + 10;
  let generatedString = '';

  for (let i = 0; i < stringLengthToGenereate; i++) {
    generatedString += availableItems[Math.floor(Math.random() * availableItems.length)];
  }

  return generatedString;
};

export default generateString;
