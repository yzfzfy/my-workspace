import React from 'react';
import { render } from '@testing-library/react';
import { BasicFirstLabel } from './first-label.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicFirstLabel />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});
