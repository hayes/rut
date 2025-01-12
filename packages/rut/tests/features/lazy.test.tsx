import React from 'react';
import { render } from '../../src/render';

// Not supported by RTR: https://github.com/facebook/react/issues/14170
describe.skip('Lazy', () => {
  // @ts-ignore
  const Comp = React.lazy(() => import('./__mocks__/Lazy'));

  it('renders an imported lazy component', () => {
    const result = render(
      <React.Suspense fallback="Loading...">
        <main>
          <Comp />
        </main>
      </React.Suspense>,
    );

    expect(result.root).toContainNode('Lazy loaded!');
  });
});
