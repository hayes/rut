import { ReactTestInstance } from 'react-test-renderer';
import { Args, UnknownProps } from './types';

export default class RutNode<Props = UnknownProps> {
  private node: ReactTestInstance;

  constructor(node: ReactTestInstance) {
    this.node = node;
  }

  children(): (string | RutNode)[] {
    return this.node.children.map(child => {
      if (typeof child === 'string') {
        return child;
      }

      return new RutNode(child);
    });
  }

  emit<K extends keyof Props>(name: K, ...args: Args<Props[K]>): unknown {
    const prop = this.prop(name);

    if (!prop) {
      throw new Error(`${name} does not exist.`);
    } else if (typeof prop !== 'function') {
      throw new TypeError(`${name} is not a function.`);
    }

    return prop(...args);
  }

  find<P = UnknownProps>(type: React.ReactType<P>): RutNode<P>[] {
    return this.node.findAllByType(type).map(node => new RutNode(node));
  }

  prop<K extends keyof Props>(name: K): Props[K] | undefined {
    return this.node.props[name as string];
  }

  props(): Props {
    return this.node.props as Props;
  }

  type(): React.ReactType {
    return this.node.type;
  }
}
