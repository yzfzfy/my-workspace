import React, { ReactNode } from 'react';
import { Label } from '@teambit/design.ui.label';
import { Button } from 'oss-ui';

export type FirstLabelProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function FirstLabel({ children }: FirstLabelProps) {
  return (
    <div>
      <Label>chart 更新</Label>
      <Label>增加一个change 为了测试snap</Label>
      {children}
      <Button>测试使用oss-ui</Button>
    </div>
  );
}
