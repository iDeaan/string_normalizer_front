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

  renderStepByStepNormalizeString(data, isToDisplayAfterIterationData = false) {
    const { currentIterationItemIndex, beforeIteration, afterIteration } = data;
    const currentIterationArray = isToDisplayAfterIterationData ? afterIteration : beforeIteration;
    return (
      currentIterationArray.map((item, index) =>
        <span
          key={index}
          className={index === currentIterationItemIndex || index === currentIterationItemIndex + 1 ? 'selected' : ''}
        >
          {item}
        </span>
      )
    )
  }

  render() {
    const { initialString, normalizedString, normalizingIterations } = this.state;

    return (
      <div className="app-container">
        <div className="string-information initial-string">
          <div className="text">Generated String:</div>
          <div className="value">{initialString}</div>
        </div>
        <div className="string-information normalized-string">
          <div className="text">Normalized String:</div>
          <div
            className="value"
            dangerouslySetInnerHTML={{__html:
                initialString !== normalizedString ? moveVowelLettersToNewString(normalizedString) : '' }}
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
        <ol className="normalizing-steps">
          {normalizingIterations.length ? normalizingIterations.map((item, index) =>
            <li key={index} className="normalize-step">
              {this.renderStepByStepNormalizeString(item)} ==> {this.renderStepByStepNormalizeString(item, true)}
            </li>
          ) : ''}
        </ol>
      </div>
    );
  }
}

export default App;
