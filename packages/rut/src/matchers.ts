import React from 'react';
import Element from './Element';
import { getTypeName } from './helpers';
import { MatchResult } from './types';

function checkIsRutElement(matcher: string, value: unknown) {
  if (value instanceof Element) {
    return;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value).constructor.name === 'Element' &&
    Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name === 'Queryable'
  ) {
    return;
  }

  throw new Error(`${matcher}: Expected a Rut \`Element\`.`);
}

export function toBeElementType(received: Element, type: React.ElementType): MatchResult {
  checkIsRutElement('toBeElementType', received);

  const expectedName = getTypeName(type);

  return {
    message: `expected \`${received}\` to be a \`${expectedName}\``,
    notMessage: `expected \`${received}\` not to be a \`${expectedName}\``,
    passed: received.type() === type,
  };
}

export function toContainNode(received: Element, node: NonNullable<React.ReactNode>): MatchResult {
  checkIsRutElement('toContainNode', received);

  const results = received.query(
    (testNode, fiberNode) => {
      if (React.isValidElement(node)) {
        return (
          testNode.type === node.type && testNode.props === node.props && fiberNode.key === node.key
        );
      }

      // RTR doesn't run the predicate on non-element nodes (like strings and numbers),
      // so we need to query the parent by traversing the children.
      // https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L388
      if (testNode.children.includes(String(node))) {
        return true;
      }

      return false;
    },
    { deep: false },
  );

  return {
    message: `expected \`${received}\` to contain node TODO`,
    notMessage: `expected \`${received}\` not to contain node TODO`,
    passed: results.length > 0,
  };
}

export function toRenderChildren(received: Element): MatchResult {
  checkIsRutElement('toRenderChildren', received);

  return {
    message: `expected \`${received}\` to render children`,
    notMessage: `expected \`${received}\` not to render children`,
    passed: received.children().length > 0,
  };
}
