import React from 'react';
import { render } from '@testing-library/react';
import { BasicSecondLabel } from './second-label.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicSecondLabel />);
  const rendered = getByText('hello from SecondLabel');
  expect(rendered).toBeTruthy();
});
