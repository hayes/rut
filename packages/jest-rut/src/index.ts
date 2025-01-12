/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { matchers, unmockFetches, MatchResult } from 'rut';
import serializer from './serializer';

const jestMatchers: jest.ExpectExtendMap = {};

Object.entries(matchers).forEach(([name, matcher]) => {
  jestMatchers[name] = function jestMatcher(this: jest.MatcherUtils, ...args: unknown[]) {
    const result: MatchResult = (matcher as Function).call(this, ...args);
    let message = `${this.utils.matcherHint(result.name)}\n\n`;

    // Append error message
    message += (this.isNot ? result.notMessage : result.message)
      .replace('{{received}}', this.utils.printReceived(result.received))
      .replace('{{expected}}', result.expected ? this.utils.printExpected(result.expected) : '')
      .replace('{{actual}}', result.actual ? String(result.actual) : '');

    // Append diff if requested
    if (result.diff) {
      message += '\n';
      message += this.utils.diff(result.expected, result.actual, {
        aAnnotation: 'Expected',
        bAnnotation: 'Actual',
      });
    }

    return {
      message: () => message,
      pass: typeof result.passed === 'function' ? result.passed(this.equals) : result.passed,
    };
  };
});

expect.extend(jestMatchers);
expect.addSnapshotSerializer(serializer);

afterEach(unmockFetches);

export default jestMatchers;
