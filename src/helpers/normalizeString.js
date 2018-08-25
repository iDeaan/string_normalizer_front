import moveLetterToEndOfString from './moveLetterToEndOfString';

const consonantLetters = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];

const isAllLettersAfterIndexHasSameType = (index, array) => {
  const firstItemType = consonantLetters.includes(array[index]);
  let sameTypes = true;

  for (let i = index; i < array.length; i++) {
    const currentItemType = consonantLetters.includes(array[i]);
    if (firstItemType !== currentItemType) {
      sameTypes = false;
      break;
    }
  }

  return sameTypes;
};


const normalizeString = (normalizedString, normalizingItemIndex) => {
  let currentIterationArray = normalizedString.split('');
  const normalizingIterations = [];

  // Letters move logic
  let i = normalizingItemIndex || 0;
  while ((i < currentIterationArray.length - 1) && !isAllLettersAfterIndexHasSameType(i, currentIterationArray)) {
    const isCurrentElementConsonantLetter = consonantLetters.includes(currentIterationArray[i]);
    const isNextElementConsonantLetter = consonantLetters.includes(currentIterationArray[i + 1]);
    const before = [...currentIterationArray]; // letters before current iteration

    if (isCurrentElementConsonantLetter === isNextElementConsonantLetter) {
      currentIterationArray = moveLetterToEndOfString(i + 1, currentIterationArray);
    } else {
      i++;
    }

    // push to array of normalize iterations (for display in render)
    normalizingIterations.push({
      currentIterationItemIndex: i,
      beforeIteration: [...before],
      afterIteration: [...currentIterationArray],
      currentIterationArray: [...currentIterationArray],
    });
  }

  return {
    currentIterationArray: currentIterationArray.join(''),
    normalizingIterations,
    iteration: i
  }
};

export default normalizeString;
