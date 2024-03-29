import { MainRuntime } from '@teambit/cli';
import {
  GeneratorMain,
  GeneratorAspect,
  ComponentContext,
} from '@teambit/generator';
import { ComponentTemplatesAspect } from './component-templates.aspect';

export class ComponentTemplatesMain {
  static slots = [];
  static dependencies = [GeneratorAspect];
  static runtime = MainRuntime;
  static async provider([generator]: [GeneratorMain]) {
    /**
     * Array of templates. Add as many templates as you want
     * Separate the templates to multiple files if you prefer
     * Modify, add or remove files as needed
     * See the docs file of this component for more info
     */

    generator.registerComponentTemplate([
      {
        name: 'component1',
        description: 'description for component1',
        generateFiles: (context: ComponentContext) => {
          return [
            // index file
            {
              relativePath: 'index.ts',
              isMain: true,
              content: `export { ${context.namePascalCase} } from './${context.name}';
export type { ${context.namePascalCase}Props } from './${context.name}';
`,
            },

            // component file
            {
              relativePath: `${context.name}.tsx`,
              content: `import React from 'react';

export type ${context.namePascalCase}Props = {
  /**
   * a text to be rendered in the component.
   */
  text1: string
};

export function ${context.namePascalCase}({ text1 }: ${context.namePascalCase}Props) {
  return (
    <div>
      {text1}
    </div>
  );
}`,
            },

            // docs file
            {
              relativePath: `${context.name}.docs.mdx`,
              content: `---
description: 'A React Component for rendering text.'
labels: ['text', 'ui']
---

import { ${context.namePascalCase} } from './${context.name}';
`,
            },

            // composition file
            {
              relativePath: `${context.name}.composition.tsx`,
              content: `import React from 'react';
import { ${context.namePascalCase} } from './${context.name}';

export const Basic${context.namePascalCase}  = () => (
  <${context.namePascalCase}  text="hello from ${context.namePascalCase} " />
);
`,
            },

            // test file
            {
              relativePath: `${context.name}.spec.tsx`,
              content: `import React from 'react';
import { render } from '@testing-library/react';
import { Basic${context.namePascalCase} } from './${context.name}.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<Basic${context.namePascalCase} />);
  const rendered = getByText('hello from ${context.namePascalCase}');
  expect(rendered).toBeTruthy();
});
`,
            },
            // add more files here such as css/sass
          ];
        },
      },

      // component 2
      {
        name: 'component2',
        description: 'description for component2',
        generateFiles: (context: ComponentContext) => {
          return [
            // index file
            {
              relativePath: 'index.ts',
              isMain: true,
              content: `export {} from '';
`,
            },
          ];
        },
      },
    ]);

    return new ComponentTemplatesMain();
  }
}

ComponentTemplatesAspect.addRuntime(ComponentTemplatesMain);
