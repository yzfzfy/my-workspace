import React from 'react';

export type SecondLabelProps = {
  /**
   * a text to be rendered in the component.
   */
  text1: string
};

export function SecondLabel({ text1 }: SecondLabelProps) {
  return (
    <div>
      {text1}
    </div>
  );
}