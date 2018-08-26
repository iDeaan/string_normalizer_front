import React, { Component } from 'react';
import PropTypes from 'prop-types';

const moveVowelLettersToNewString = (string, vowelLetters) => {
  const array = string.split('');
  let j = array.length - 1;
  while (vowelLetters.includes(array[j])) {
    array.splice(j, 0, '_');
    j--;
  }
  return array;
};

export default class NormalizedString extends Component {
  static propTypes = {
    initialString: PropTypes.string,
    normalizedString: PropTypes.string,
    vowelLetters: PropTypes.array
  };

  static defaultProps = {
    initialString: '',
    normalizedString: '',
    vowelLetters: []
  };

  render() {
    const { initialString, normalizedString, vowelLetters } = this.props;
    const normalizedStringWithTransference = moveVowelLettersToNewString(normalizedString, vowelLetters);

    return (
      <div className="normalized-string value">
        {initialString !== normalizedString && normalizedStringWithTransference.length
          ? normalizedStringWithTransference.map(item =>
            item === '_' ? <br /> : <span>{item}</span>
          )
          : ''
        }
      </div>
    );
  }
}
