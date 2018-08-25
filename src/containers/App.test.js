import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import normalizeString from '../helpers/normalizeString';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('string normalization', () => {
  expect(normalizeString('gmae').currentIterationArray).toEqual('game');
  expect(normalizeString('lukeskywalker').currentIterationArray).toEqual('lukesywalerkk');
  expect(normalizeString('youtubecom').currentIterationArray).toEqual('ytubecomou');
  expect(normalizeString('toooomaaaaaanyvooowels').currentIterationArray).toEqual('tomanyvowelosooaaaaaoo');
});
