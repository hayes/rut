import React from 'react';
import {
  act,
  create,
  ReactTestRenderer,
  ReactTestRendererJSON,
  ReactTestRendererTree,
} from 'react-test-renderer';
import Element from './Element';
import Queryable from './Queryable';
import debug from './debug';
import { UnknownProps } from './types';

export default class Renderer<Props = UnknownProps> extends Queryable {
  private element: React.ReactElement<Props>;

  private renderer: ReactTestRenderer;

  constructor(element: React.ReactElement<Props>) {
    super();

    this.element = element;
    this.renderer = create(element);
  }

  /**
   * Return a rough JSX representation of the current React component tree.
   * Does not include the following exotic components or nodes:
   *
   *  - Context consumers and providers
   *  - Memo components
   */
  debug(): string {
    return debug(this.toTree());
  }

  /**
   * Return the root component as an `Element`.
   */
  root(): Element<Props> {
    return new Element(this.renderer.root);
  }

  /**
   * Return an object representing the rendered tree. This tree only contains
   * the platform-specific nodes and their props, but doesn’t contain any user-written
   * components. This is handy for snapshot testing.
   */
  toJSON(): ReactTestRendererJSON | null {
    return this.renderer.toJSON();
  }

  /**
   * Return an object representing the rendered tree. Unlike `toJSON()`,
   * the representation is more detailed than the one provided by `toJSON()`,
   * and includes the user-written components.
   */
  toTree(): ReactTestRendererTree | null {
    return this.renderer.toTree();
  }

  /**
   * Unmount the in-memory tree, triggering the appropriate lifecycle events.
   */
  async unmount() {
    await act(async () => {
      await this.renderer.unmount();
    });
  }

  /**
   * Re-render the in-memory tree with optional new props or children. This simulates
   * a React update at the root. If the new element has the same type and key as the
   * previous element, the tree will be updated; otherwise, it will mount a new tree.
   */
  async update(newProps?: Partial<Props>, newChildren?: React.ReactNode) {
    const { children, ...props } = this.element.props as {
      children?: React.ReactNode;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };

    await act(async () => {
      await this.renderer.update(
        React.cloneElement(this.element, { ...props, ...newProps }, newChildren || children),
      );
    });
  }

  protected testInstance() {
    return this.renderer.root;
  }
}
