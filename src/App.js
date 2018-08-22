import React, { Component } from 'react';
import './App.css';

const consonantLetters = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
const vowelLetters = ['a', 'e', 'i', 'o', 'u', 'y'];

const moveLetterToEndOfString = (index, array) => {
  const movingItem = array[index];
  array.splice(index, 1);
  return [...array, movingItem];
};

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

const moveVowelLettersToNewString = (string) => {
  const array = string.split('');
  let j = array.length - 1;
  while (vowelLetters.includes(array[j])) {
    array.splice(j, 0, '<br />');
    j--;
  }
  return array.join('');
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialString: 'aabcdefagataaa',
      normalizedString: 'aabcdefagataaa',
      normalizingIterations: [],
      normalizingItemIndex: null
    }
  }

  handleStringGenerate() {
    const lettersToGenerateNumber = Math.floor(Math.random() * 20) + 10;
    const allAvailableLetters = [...consonantLetters, ...vowelLetters];
    let generatedString = '';

    for (let i = 0; i < lettersToGenerateNumber; i++) {
      generatedString += allAvailableLetters[Math.floor(Math.random() * allAvailableLetters.length)];
    }

    this.setState({ initialString: generatedString, normalizedString: generatedString });
  }

  handleStringNormalize() {
    const { normalizedString } = this.state;

    let currentIterationArray = normalizedString.split('');
    const normalizingIterations = [];

    // Letters move logic
    let i = 0;
    while ((i < currentIterationArray.length - 1) && !isAllLettersAfterIndexHasSameType(i, currentIterationArray)) {
      const isCurrentElementConsonantLetter = consonantLetters.includes(currentIterationArray[i]);
      const isNextElementConsonantLetter = consonantLetters.includes(currentIterationArray[i + 1]);

      if (isCurrentElementConsonantLetter === isNextElementConsonantLetter) {
        currentIterationArray = moveLetterToEndOfString(i + 1, currentIterationArray);
      } else {
        i++;
      }

      normalizingIterations.push({
        currentIterationItemIndex: i + 1,
        currentIterationArray,
      });
    }

    this.setState({ normalizedString: currentIterationArray.join(''), normalizingIterations });
  }

  handleReset() {
    const { initialString } = this.state;
    this.setState({ normalizedString: initialString });
  }

  handleReturnToState() {
    const { normalizingIterations } = this.state;
    const randomPreviousState = Math.floor(Math.random() * normalizingIterations.length - 1) + 1;

    const currentIterationData = normalizingIterations[randomPreviousState];

    this.setState({
      normalizedString: currentIterationData.currentIterationArray.join(''),
      normalizingItemIndex: currentIterationData.currentIterationItemIndex
    });

  }

  render() {
    const { initialString, normalizedString } = this.state;

    return (
      <div className="app-container">
        <div className="initial-string">
          <div className="text">Generated String:</div>
          <div className="value">{initialString}</div>
        </div>
        <div className="normalized-string">
          <div className="text">Normalized String1:</div>
          <div
            className="value"
            dangerouslySetInnerHTML={{__html:
                initialString !== normalizedString ? moveVowelLettersToNewString(normalizedString) : normalizedString }}
          />
        </div>
        <div className="actions-list">
          <div
            className="button"
            onClick={() => this.handleStringGenerate()}
          >
            Generate String
          </div>
          <div
            className="button"
            onClick={() => this.handleReset()}
          >
            Reset String
          </div>
          <div
            className="button"
            onClick={() => this.handleStringNormalize()}
          >
            Normalize String
          </div>
          <div
            className="button"
            onClick={() => this.handleReturnToState()}
          >
            Return to previous state
          </div>
          <div
            className="button"
            onClick={() => console.log('save to sever')}
          >
            Save to server
          </div>
          <div
            className="button"
            onClick={() => console.log('load from sever')}
          >
            Load from server
          </div>
        </div>
      </div>
    );
  }
}

export default App;
