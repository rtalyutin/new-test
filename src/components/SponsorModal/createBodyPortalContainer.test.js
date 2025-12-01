import { assert, test } from 'vitest';

import { createBodyPortalContainer } from './createBodyPortalContainer.js';

const createStubDocument = () => {
  const body = {
    children: [],
    appendChild(node) {
      if (!this.children.includes(node)) {
        this.children.push(node);
        node.parentNode = this;
      }
      return node;
    },
    removeChild(node) {
      const index = this.children.indexOf(node);
      if (index !== -1) {
        this.children.splice(index, 1);
        node.parentNode = null;
      }
      return node;
    },
    contains(node) {
      return this.children.includes(node);
    },
  };

  return {
    body,
    createElement(tagName) {
      return {
        tagName,
        parentNode: null,
      };
    },
  };
};

test('createBodyPortalContainer attaches container to the provided body and cleans up', () => {
  const stubDocument = createStubDocument();

  const { container, dispose } = createBodyPortalContainer(stubDocument);

  assert.equal(container.tagName, 'div');
  assert.equal(container.parentNode, stubDocument.body);
  assert.ok(stubDocument.body.contains(container));

  dispose();

  assert.equal(container.parentNode, null);
  assert.ok(!stubDocument.body.contains(container));
});

test('dispose is safe to call multiple times', () => {
  const stubDocument = createStubDocument();

  const { dispose } = createBodyPortalContainer(stubDocument);

  dispose();
  assert.doesNotThrow(() => {
    dispose();
  });
});
