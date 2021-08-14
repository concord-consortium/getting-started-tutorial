import React from 'react';
import ReactDOM from 'react-dom';
import WeaterxTutorial from './weatherx-tutorial';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WeaterxTutorial />, div);
  ReactDOM.unmountComponentAtNode(div);
});
