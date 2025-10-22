export function createBodyPortalContainer(doc) {
  const container = doc.createElement('div');
  doc.body.appendChild(container);

  const dispose = () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  return { container, dispose };
}
