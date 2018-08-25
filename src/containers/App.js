import React, { Component } from 'react';
import './App.css';
import Notification from "../components/Notification/Notification";
import Button from "../components/Button/Button";

const consonantLetters = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
const vowelLetters = ['a', 'e', 'i', 'o', 'u', 'y'];
const apiHost = 'http://167.99.34.5/';

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
      initialString: '', // aabcdefagataaa
      normalizedString: '',
      normalizingIterations: [],
      normalizingItemIndex: null,
      notification: null
    }
  }

  handleStringGenerate() {
    const lettersToGenerateNumber = Math.floor(Math.random() * 20) + 10;
    const allAvailableLetters = [...consonantLetters, ...vowelLetters];
    let generatedString = '';

    for (let i = 0; i < lettersToGenerateNumber; i++) {
      generatedString += allAvailableLetters[Math.floor(Math.random() * allAvailableLetters.length)];
    }

    this.setState({
      initialString: generatedString,
      normalizedString: generatedString,
      normalizingItemIndex: 0
    });
  }

  handleStringNormalize() {
    const { normalizedString, normalizingItemIndex } = this.state;

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

    this.setState({ normalizedString: currentIterationArray.join(''), normalizingIterations, normalizingItemIndex: i });
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

  loadData() {
    fetch(apiHost)
      .then(res => res.json())
      .then(res => {
        if (res.meta.code === 200) {
          const { initialString, normalizedString, iteration: normalizingItemIndex } = res.data;
          this.setState({
            initialString,
            normalizedString,
            normalizingItemIndex
          });
        } else {
          const notification = {
            message: 'Records not found',
            type: 'error'
          };
          this.setState({ notification });
        }
      });
  }

  saveData() {
    const { initialString, normalizedString, normalizingItemIndex } = this.state;

    const settings = {
      method: 'POST',
      body: JSON.stringify({
        initialString,
        normalizedString,
        iteration: normalizingItemIndex
      })
    };

    fetch(apiHost, settings)
      .then(res => res.json())
      .then(res => {
        if (res.meta.code === 200) {
          const notification = {
            message: 'SAVE SUCCESS',
            type: 'success'
          };
          this.setState({ notification });
        } else {
          const notification = {
            message: 'SAVE FAIL',
            type: 'error'
          };
          this.setState({ notification });
        }
      });
  }

  render() {
    const { initialString, normalizedString, normalizingIterations, notification, normalizingItemIndex } = this.state;

    return (
      <div className="app-container">
        {notification
          ?
            <Notification
              notification={notification}
              onNotificationClose={() => this.setState({ notification: null })}
            />
          : ''
        }
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
        <div>
          {normalizingItemIndex
            ? `Last index worked with: ${normalizingItemIndex}`
            : ''}
        </div>
        <div className="actions-list">
          <Button title="Generate String" onClick={() => this.handleStringGenerate()} />
          <Button title="Load from server" onClick={() => this.loadData()} />
          <Button title="Reset String" onClick={() => this.handleReset()} isToRender={!!normalizedString} />
          <Button title="Normalize String" onClick={() => this.handleStringNormalize()} isToRender={!!initialString} />
          <Button
            title="Return to previous state" onClick={() => this.handleReturnToState()}
            isToRender={!!normalizedString}
          />
          <Button
            title="Save to server" onClick={() => this.saveData()}
            isToRender={!!normalizedString}
          />
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
