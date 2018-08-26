import React, { Component } from 'react';
import './App.css';
import Notification from "../components/Notification/Notification";
import Button from "../components/Button/Button";
import helpers from '../helpers';

const { generateString, normalizeString } = helpers;

const consonantLetters = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];
const vowelLetters = ['a', 'e', 'i', 'o', 'u', 'y'];
const apiHost = 'http://167.99.34.5/';

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
    const allAvailableLetters = [...consonantLetters, ...vowelLetters];
    const generatedString = generateString(allAvailableLetters);

    this.setState({
      initialString: generatedString,
      normalizedString: generatedString,
      normalizingItemIndex: 0
    });
  }

  handleStringNormalize() {
    const { normalizedString, normalizingItemIndex } = this.state;

    const normalizationResultData = normalizeString(normalizedString, normalizingItemIndex);
    const { currentIterationArray, normalizingIterations, iteration } = normalizationResultData;

    if (normalizingIterations.length === 0) {
      this.setState({
        notification: {
          message: 'String is already normalized',
          type: 'success'
        }
      })
    } else {
      this.setState({
        normalizedString: currentIterationArray,
        normalizingIterations,
        normalizingItemIndex: iteration
      });
    }
  }

  handleReset() {
    const { initialString } = this.state;

    this.setState({
      normalizedString: initialString,
      normalizingIterations: [],
      normalizingItemIndex: null
    });
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
            normalizingItemIndex,
            normalizingIterations: []
          });
        } else {
          const notification = {
            message: 'Records not found',
            type: 'error'
          };
          this.setState({ notification });
        }
      }).catch(() => {
        const notification = {
          message: 'Oops! Something went wrong!',
          type: 'error'
        };
        this.setState({ notification });
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
      })
      .catch(() => {
        const notification = {
          message: 'Oops! Something went wrong!',
          type: 'error'
        };
        this.setState({ notification });
      });
  }

  handleInputChange = (event) => {
    const stringPattern = /^[a-z]+$/;
    const inputValue = event.target.value;

    if (!inputValue || stringPattern.test(inputValue)) {
      this.setState({ initialString: inputValue, normalizedString: inputValue, notification: null });
    } else {
      const notification = {
        message: 'Input latin letters only. (lowercase)',
        type: 'error'
      };
      this.setState({ notification });
    }
  };

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
        <div className="string-information text-input">
          <div className="text">Input String (f.e 'toooomaaaaaanyvooowels'):</div>
          <input
            className="value"
            type="text"
            value={this.state.initialString}
            onChange={this.handleInputChange}
          />
        </div>
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
          {normalizingItemIndex !== null
            ? `Last index worked with: ${normalizingItemIndex}`
            : ''}
        </div>
        <div className="actions-list">
          <Button title="Generate String" onClick={() => this.handleStringGenerate()} />
          <Button title="Load from server" onClick={() => this.loadData()} />
          <Button
            title="Reset String"
            onClick={() => this.handleReset()}
            isToRender={!!normalizedString && initialString !== normalizedString}
          />
          <Button title="Normalize String" onClick={() => this.handleStringNormalize()} isToRender={!!initialString} />
          <Button
            title="Return to random previous state"
            onClick={() => this.handleReturnToState()}
            isToRender={!!normalizedString && !!normalizingIterations.length}
          />
          <Button
            title="Save to server"
            onClick={() => this.saveData()}
            isToRender={!!normalizedString}
          />
        </div>
        {normalizingIterations.length
          ? (
            <div>
              <h3>Normalization steps:</h3>
              <ol className="normalizing-steps">
                {normalizingIterations.map((item, index) =>
                  <li key={index} className="normalize-step">
                    {this.renderStepByStepNormalizeString(item)} ==> {this.renderStepByStepNormalizeString(item, true)}
                  </li>
                )}
              </ol>
            </div>
          )
          : ''
        }
      </div>
    );
  }
}

export default App;
