import React from 'react';
import ReactDOM from 'react-dom';
import GettingStartedTutorial from './getting-started-tutorial';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GettingStartedTutorial />, div);
  ReactDOM.unmountComponentAtNode(div);
});
