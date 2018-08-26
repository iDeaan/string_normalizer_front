import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class NormalizingIterations extends Component {
  static propTypes = {
    normalizingIterations: PropTypes.array
  };

  static defaultProps = {
    normalizingIterations: []
  };

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
    const { normalizingIterations } = this.props;

    return (
      normalizingIterations.length
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
    );
  }
}
